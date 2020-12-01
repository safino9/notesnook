import React from "react";
import { db } from "../common";
import FavoritesPlaceholder from "../components/placeholders/favorites-placeholder";
import RouteContainer from "../components/route-container";
import { toTitleCase } from "../utils/string";
import Home from "../views/home";
import Notebooks from "../views/notebooks";
import Notes from "../views/notes.js";
import Search from "../views/search";
import Settings from "../views/settings";
import Tags from "../views/tags";
import Trash from "../views/trash";

const routes = {
  "/": () => <RouteContainer type="notes" title="Notes" route={<Home />} />,
  "/notebooks*": () => <Notebooks />,
  "/favorites": () => (
    <RouteContainer
      title="Favorites"
      type="favorites"
      route={
        <Notes
          placeholder={FavoritesPlaceholder}
          context={{ type: "favorites" }}
        />
      }
    />
  ),
  "/trash": () => (
    <RouteContainer type="trash" title="Trash" route={<Trash />} />
  ),
  "/tags*": () => <Tags />,
  "/colors/:color": ({ color }) => (
    <RouteContainer
      type="notes"
      title={toTitleCase(db.colors.tag(color).title)}
      route={<Notes context={{ type: "color", value: color }} />}
    />
  ),
  "/settings": () => <RouteContainer title="Settings" route={<Settings />} />,
  "/search": () => (
    <RouteContainer type="search" canGoBack title="Search" route={<Search />} />
  ),
};

export default routes;
