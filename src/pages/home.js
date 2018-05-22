import React from "react";

import AnimeList from "../components/animeList";
import Banner from "../components/banner";

export default class extends React.Component {
  render() {
    return (
      <main>
        <Banner />
        <AnimeList twist={this.props.mir.twist} />
      </main>
    );
  }
}
