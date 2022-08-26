import React, { useEffect, useRef, useState } from "react";
import { Modal, View } from "react-native";
import { useThemeStore } from "../../stores/use-theme-store";
import { useUserStore } from "../../stores/use-user-store";
import BiometricService from "../../services/biometrics";
import {
  eSendEvent,
  eSubscribeEvent,
  eUnSubscribeEvent,
  presentSheet,
  ToastEvent
} from "../../services/event-manager";
import { clearMessage } from "../../services/message";
import PremiumService from "../../services/premium";
import Sync from "../../services/sync";
import { db } from "../../common/database";
import { MMKV } from "../../common/database/mmkv";
import { SIZE } from "../../utils/size";
import { sleep } from "../../utils/time";
import { IconButton } from "../ui/icon-button";
import { Button } from "../ui/button";
import { Dialog } from "../dialog";
import { presentDialog } from "../dialog/functions";
import Input from "../ui/input";
import { Toast } from "../toast";
import Heading from "../ui/typography/heading";
import Paragraph from "../ui/typography/paragraph";
import SettingsService from "../../services/settings";
import TwoFactorVerification from "./two-factor";
import SheetProvider from "../sheet-provider";
import { Progress } from "../sheets/progress";

function getEmail(email) {
  if (!email) return null;
  return email.replace(/(.{2})(.*)(?=@)/, function (gp1, gp2, gp3) {
    for (let i = 0; i < gp3.length; i++) {
      gp2 += "*";
    }
    return gp2;
  });
}

export const SessionExpired = () => {
  const colors = useThemeStore((state) => state.colors);
  const email = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const password = useRef();
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);

  const setUser = useUserStore((state) => state.setUser);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    try {
      await db.user.logout();
      await BiometricService.resetCredentials();
      await SettingsService.set({
        introCompleted: true
      });
      setVisible(false);
    } catch (e) {
      ToastEvent.show({
        heading: e.message,
        type: "error",
        context: "local"
      });
    }
  };

  useEffect(() => {
    eSubscribeEvent("session_expired", open);
    return () => {
      eUnSubscribeEvent("session_expired", open);
      setFocused(false);
    };
  }, [visible]);

  const open = async () => {
    try {
      console.log("REQUESTING NEW TOKEN");
      let res = await db.user.tokenManager.getToken();
      if (!res) throw new Error("no token found");
      if (db.user.tokenManager._isTokenExpired(res))
        throw new Error("token expired");
      Sync.run("global", false, true, async (complete) => {
        if (!complete) {
          let user = await db.user.getUser();
          if (!user) return;
          email.current = user.email;
          setVisible(true);
          return;
        }
        SettingsService.set({
          sessionExpired: false
        });
        setVisible(false);
      });
    } catch (e) {
      console.log(e);
      let user = await db.user.getUser();
      if (!user) return;
      email.current = user.email;
      setVisible(true);
    }
  };

  const login = async (mfa, callback) => {
    if (error) return;
    setLoading(true);
    let user;
    try {
      if (mfa) {
        await db.user.mfaLogin(
          email.current.toLowerCase(),
          password.current,
          mfa
        );
      } else {
        await db.user.login(email.current.toLowerCase(), password.current);
      }
      callback && callback(true);
      setVisible(false);
      user = await db.user.getUser();
      if (!user) throw new Error("Email or password incorrect!");
      PremiumService.setPremiumStatus();
      setUser(user);
      clearMessage();
      ToastEvent.show({
        heading: "Login successful",
        message: `Logged in as ${user.email}`,
        type: "success",
        context: "global"
      });
      await SettingsService.set({
        sessionExpired: false,
        userEmailConfirmed: user?.isEmailConfirmed
      });
      eSendEvent("userLoggedIn", true);
      await sleep(500);
      Progress.present();
      setLoading(false);
    } catch (e) {
      callback && callback(false);
      if (e.message === "Multifactor authentication required.") {
        TwoFactorVerification.present(async (mfa) => {
          if (mfa) {
            console.log(mfa);
            await login(mfa);
          } else {
            setLoading(false);
          }
        }, e.data);
      } else {
        console.log(e.stack);
        setLoading(false);
        ToastEvent.show({
          heading: user ? "Failed to sync" : "Login failed",
          message: e.message,
          type: "error",
          context: "local"
        });
      }
    }
  };
  return (
    visible && (
      <Modal
        onShow={async () => {
          await sleep(300);
          passwordInputRef.current?.focus();
          setFocused(true);
        }}
        visible={true}
      >
        <SheetProvider context="two_factor_verify" />
        <View
          style={{
            width: focused ? "100%" : "99.9%",
            padding: 12,
            justifyContent: "center",
            flex: 1
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              marginBottom: 20,
              borderRadius: 10,
              paddingVertical: 20
            }}
          >
            <IconButton
              customStyle={{
                width: 60,
                height: 60
              }}
              name="alert"
              color={colors.errorText}
              size={50}
            />
            <Heading size={SIZE.xxxl} color={colors.heading}>
              Session expired
            </Heading>
            <Paragraph
              style={{
                textAlign: "center"
              }}
            >
              Your session on this device has expired. Please enter password for{" "}
              {getEmail(email.current)} to continue.
            </Paragraph>
          </View>

          <Input
            fwdRef={passwordInputRef}
            onChangeText={(value) => {
              password.current = value;
            }}
            returnKeyLabel="Next"
            returnKeyType="next"
            secureTextEntry
            autoComplete="password"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Password"
            onSubmit={() => login()}
          />

          <Button
            style={{
              marginTop: 10,
              width: "100%"
            }}
            loading={loading}
            onPress={() => login()}
            type="accent"
            title={loading ? null : "Login"}
          />

          <Button
            style={{
              marginTop: 10,
              width: "100%"
            }}
            onPress={() => {
              presentDialog({
                context: "session_expiry",
                title: "Logout",
                paragraph:
                  "Are you sure you want to logout from this device? Any unsynced changes will be lost.",
                positiveText: "Logout",
                positiveType: "errorShade",
                positivePress: logout
              });
            }}
            type="errorShade"
            title={loading ? null : "Logout from this device"}
          />
        </View>
        <Toast context="local" />
        <Dialog context="session_expiry" />
      </Modal>
    )
  );
};