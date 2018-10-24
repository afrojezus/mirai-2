// The main video player for the application. Fuck ReactPlayer. Fuck depending on other shit for tiny things.
import * as React from 'react';

export default class VideoPlayer extends React.Component {
    public render() {
        return (
            <div>
                <video/>
            </div>
        )
    }
}