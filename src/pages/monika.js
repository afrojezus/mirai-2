import React, { Component } from "react";

import spaceBgEmpty from "../assets/monika/monika_room.png";
import monispace from "../assets/monika/monika_bg.png";
import moniscare from "../assets/monika/monika_scare.png";
import textbox from "../assets/monika/textbox.png";
import moni from "./monikastuff";

class Monika extends Component {
  state = {
    dialog: "",
    wait: false,
    img: true,
    scare: false,
  };

  componentWillMount = () => {
    this.setState({ dialog: moni[0][0], text: 0, topic: 0 });
  };

  next = () => {
    if (this.state.text + 1 > moni[this.state.topic].length) {
      this.setState({ dialog: "", wait: true });
      setTimeout(() => {
        if (this.state.topic + 1 > Object.values(moni).length - 1) {
          this.setState({ scare: true, img: false }, () =>
            setTimeout(
              () =>
                this.setState({ scare: false }, () =>
                  this.props.history.goBack()
                ),
              200
            )
          );
        } else {
          this.setState({
            dialog: moni[this.state.topic + 1][0],
            text: 0,
            topic: this.state.topic + 1,
            wait: false,
          });
        }
      }, 10000);
    } else
      this.setState({
        dialog: moni[this.state.topic][this.state.text + 1],
        text: this.state.text + 1,
        topic: this.state.topic,
        wait: false,
      });
  };

  render() {
    const { classes } = this.props;
    const { dialog, wait, scare, img } = this.state;
    return (
      <div className={classes.root}>
        <img
          src={img ? monispace : scare ? moniscare : spaceBgEmpty}
          alt=""
          style={
            scare
              ? { transform: "scale(3) translateY(20%)", animation: "none" }
              : null
          }
        />
        <div style={wait ? { opacity: 0, pointerEvents: "none" } : null}>
          <div>
            <span>{dialog}</span>
          </div>
          <div className={classes.buttonbar}>
            <div style={{ flex: 1 }} />
            <button onClick={this.next}>Next</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Monika;
