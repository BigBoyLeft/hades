# Hades

`Hades` is a new open source framework. Unlike no other, this framework integrates its own custom compiler which handles many tasks such as managing server artifacts, running the server process, building and compiling resources, and more!

# Features

-   `Artifacts Manager` This framework automatically handles the downloading and updateing of the server's artifacts depending on the servers environment configurations. Each environment configuration can depict which artifacts version to use.

-   `Resource Compilation` This framework features a completly custom compiler that allows for fivem resources to be written in typescript without having to do any additional setup. Under the hood the compiler uses `esbuild` to transpile the code into fivem readable `commonjs`.

-   `User Interfaces` This framework uses `Vue` for the User Interfaces. Unlike other frameworks, you can addon to the User Interface by simply creating a `ui` folder under your resource/module and put your frontend components in there and upon building it will be compiled into the rest of the UI
