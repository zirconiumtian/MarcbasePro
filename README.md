# MarcbasePro

> **English** / [简体中文](/docs/README.zh.md)

MarcbasePro is a free screen writing application designed for high school education in China.

MarcbasePro is inspired by [Seewo Whiteboard](https://easinote.seewo.com). It aims to address issues such as **mandatory sign-in** and **unnecessary feature bloat**, while introducing a new writing experience and interaction model optimized for specific classroom scenarios.

## Technology Stack and Components

MarcbasePro is built with [TurboWarp](https://turbowarp.org). Some of the JavaScript extensions used by the project were developed with assistance from `ChatGPT 5.6 Sol`.

MarcbasePro is intended to run as a **packaged application**.

## Packaging and Usage

If you have an Internet connection, please use the [TurboWarp Packager](https://packager.turbowarp.org).

Alternatively, if you have the [TurboWarp Desktop Editor](https://desktop.turbowarp.org) installed, use `File` > `Package Project` from the desktop editor.

Make sure the following settings are enabled:

| Setting | Value |
| --- | --- |
| Custom Framerate | 60 |
| High Quality Pen | Yes |
| Infinite Clones | Yes |
| Remove Fencing | Yes |
| Remove Miscellaneous Limits | Yes |
| Close Window When Project Stops | Yes |
| Custom Stage Size | 960x540 |
| Automatically Start Instead of Showing a Large Green Flag | Yes |

Then package the project as an `Electron` application for your platform.

You can also download pre-packaged archives from our Releases page.

## Planned Features

- **Infinite Canvas**: Write continuously without having to open a separate infinite-canvas mode such as Seewo's "board within a board" feature.
- **Undo and Redo**: Keep track of writing operations and allow previous actions to be undone or restored.
- **A More Comfortable UI**: A cleaner interface with smooth animations and, hopefully, slightly better looks.
- **Cartesian Coordinate Workspace**: Supports:
  - **2D Cartesian coordinate systems** for insertion, editing, visualization, and related operations.
  - **3D Cartesian coordinate systems** for insertion, editing, and visualization, including support for creating 3D geometry, vectors, and related mathematical objects.
- **Periodic-Table-Based Keyboard**: Quickly insert chemical expressions and related notation.

More features may be planned and added in the future.

## License

MarcbasePro is licensed under the [Apache License 2.0](/LICENSE).