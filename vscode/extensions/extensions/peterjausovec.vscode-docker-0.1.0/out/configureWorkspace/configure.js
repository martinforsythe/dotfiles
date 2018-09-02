"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const gradleParser = require("gradle-to-js/lib/parser");
const path = require("path");
const pomParser = require("pom-parser");
const vscode = require("vscode");
const extensionVariables_1 = require("../extensionVariables");
const async_1 = require("../helpers/async");
const telemetry_1 = require("../telemetry/telemetry");
const config_utils_1 = require("./config-utils");
// tslint:disable-next-line:max-func-body-length
function genDockerFile(serviceName, platform, os, port, { cmd, author, version, artifactName }) {
    switch (platform.toLowerCase()) {
        case 'node.js':
            return `FROM node:8.9-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE ${port}
CMD ${cmd}`;
        case 'go':
            return `
#build stage
FROM golang:alpine AS builder
WORKDIR /go/src/app
COPY . .
RUN apk add --no-cache git
RUN go-wrapper download   # "go get -d -v ./..."
RUN go-wrapper install    # "go install -v ./..."

#final stage
FROM alpine:latest
RUN apk --no-cache add ca-certificates
COPY --from=builder /go/bin/app /app
ENTRYPOINT ./app
LABEL Name=${serviceName} Version=${version}
EXPOSE ${port}
`;
        case '.net core console':
            if (os.toLowerCase() === 'windows') {
                return `

FROM microsoft/dotnet:2.0-runtime-nanoserver-1709 AS base
WORKDIR /app

FROM microsoft/dotnet:2.0-sdk-nanoserver-1709 AS build
WORKDIR /src
COPY ${serviceName}.csproj ${serviceName}/
RUN dotnet restore ${serviceName}/${serviceName}.csproj
WORKDIR /src/${serviceName}
COPY . .
RUN dotnet build ${serviceName}.csproj -c Release -o /app

FROM build AS publish
RUN dotnet publish ${serviceName}.csproj -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "${serviceName}.dll"]
`;
            }
            else {
                return `
FROM microsoft/dotnet:2.0-runtime AS base
WORKDIR /app

FROM microsoft/dotnet:2.0-sdk AS build
WORKDIR /src
COPY ${serviceName}.csproj ${serviceName}/
RUN dotnet restore ${serviceName}/${serviceName}.csproj
WORKDIR /src/${serviceName}
COPY . .
RUN dotnet build ${serviceName}.csproj -c Release -o /app

FROM build AS publish
RUN dotnet publish ${serviceName}.csproj -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "${serviceName}.dll"]
`;
            }
        case 'asp.net core':
            if (os.toLowerCase() === 'windows') {
                return `
FROM microsoft/aspnetcore:2.0-nanoserver-1709 AS base
WORKDIR /app
EXPOSE ${port}

FROM microsoft/aspnetcore-build:2.0-nanoserver-1709 AS build
WORKDIR /src
COPY ${serviceName}.csproj ${serviceName}/
RUN dotnet restore ${serviceName}/${serviceName}.csproj
WORKDIR /src/${serviceName}
COPY . .
RUN dotnet build ${serviceName}.csproj -c Release -o /app

FROM build AS publish
RUN dotnet publish ${serviceName}.csproj -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "${serviceName}.dll"]
`;
            }
            else {
                return `
FROM microsoft/aspnetcore:2.0 AS base
WORKDIR /app
EXPOSE ${port}

FROM microsoft/aspnetcore-build:2.0 AS build
WORKDIR /src
COPY ${serviceName}.csproj ${serviceName}/
RUN dotnet restore ${serviceName}/${serviceName}.csproj
WORKDIR /src/${serviceName}
COPY . .
RUN dotnet build ${serviceName}.csproj -c Release -o /app

FROM build AS publish
RUN dotnet publish ${serviceName}.csproj -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "${serviceName}.dll"]
`;
            }
        case 'python':
            return `
# Python support can be specified down to the minor or micro version
# (e.g. 3.6 or 3.6.3).
# OS Support also exists for jessie & stretch (slim and full).
# See https://hub.docker.com/r/library/python/ for all supported Python
# tags from Docker Hub.
FROM python:alpine

# If you prefer miniconda:
#FROM continuumio/miniconda3

LABEL Name=${serviceName} Version=${version}
EXPOSE ${port}

WORKDIR /app
ADD . /app

# Using pip:
RUN python3 -m pip install -r requirements.txt
CMD ["python3", "-m", "${serviceName}"]

# Using pipenv:
#RUN python3 -m pip install pipenv
#RUN pipenv install --ignore-pipfile
#CMD ["pipenv", "run", "python3", "-m", "${serviceName}"]

# Using miniconda (make sure to replace 'myenv' w/ your environment name):
#RUN conda env create -f environment.yml
#CMD /bin/bash -c "source activate myenv && python3 -m ${serviceName}"
`;
        case 'ruby':
            return `
FROM ruby:2.5-slim

LABEL Name=${serviceName} Version=${version}
EXPOSE ${port}

# throw errors if Gemfile has been modified since Gemfile.lock
RUN bundle config --global frozen 1

WORKDIR /app
COPY . /app

COPY Gemfile Gemfile.lock ./
RUN bundle install

CMD ["ruby", "${serviceName}.rb"]
`;
        case 'java':
            const artifact = artifactName ? artifactName : `${serviceName}.jar`;
            return `
FROM openjdk:8-jdk-alpine
VOLUME /tmp
ARG JAVA_OPTS
ENV JAVA_OPTS=$JAVA_OPTS
ADD ${artifact} ${serviceName}.jar
EXPOSE ${port}
ENTRYPOINT exec java $JAVA_OPTS -jar ${serviceName}.jar
# For Spring-Boot project, use the entrypoint below to reduce Tomcat startup time.
#ENTRYPOINT exec java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -jar ${serviceName}.jar
`;
        default:
            return `
FROM docker/whalesay:latest
LABEL Name=${serviceName} Version=${version}
RUN apt-get -y update && apt-get install -y fortunes
CMD /usr/games/fortune -a | cowsay
`;
    }
}
function genDockerCompose(serviceName, platform, os, port) {
    switch (platform.toLowerCase()) {
        case 'node.js':
            return `version: '2.1'

services:
  ${serviceName}:
    image: ${serviceName}
    build: .
    environment:
      NODE_ENV: production
    ports:
      - ${port}:${port}`;
        case 'go':
            return `version: '2.1'

services:
  ${serviceName}:
    image: ${serviceName}
    build: .
    ports:
      - ${port}:${port}`;
        case '.net core console':
            // we don't generate compose files for .net core
            return `version: '2.1'

services:
  ${serviceName}:
    image: ${serviceName}
    build: .
    ports:
      - ${port}:${port}`;
        case 'asp.net core':
            // we don't generate compose files for .net core
            return `version: '2.1'

services:
  ${serviceName}:
    image: ${serviceName}
    build: .
    ports:
      - ${port}:${port}`;
        case 'python':
            return `version: '2.1'

services:
  ${serviceName}:
    image: ${serviceName}
    build: .
    ports:
      - ${port}:${port}`;
        case 'ruby':
            return `version: '2.1'

services:
  ${serviceName}:
    image: ${serviceName}
    build: .
    ports:
      - ${port}:${port}`;
        case 'java':
            return `version: '2.1'

services:
  ${serviceName}:
    image: ${serviceName}
    build: .
    ports:
      - ${port}:${port}`;
        default:
            return `version: '2.1'

services:
  ${serviceName}:
    image: ${serviceName}
    build: .
    ports:
      - ${port}:${port}`;
    }
}
// tslint:disable-next-line:max-func-body-length
function genDockerComposeDebug(serviceName, platform, os, port, { fullCommand: cmd }) {
    switch (platform.toLowerCase()) {
        case 'node.js':
            const cmdArray = cmd.split(' ');
            if (cmdArray[0].toLowerCase() === 'node') {
                cmdArray.splice(1, 0, '--inspect=0.0.0.0:9229');
                cmd = `command: ${cmdArray.join(' ')}`;
            }
            else {
                cmd = '## set your startup file here\n    command: node --inspect index.js';
            }
            return `version: '2.1'

services:
  ${serviceName}:
    image: ${serviceName}
    build: .
    environment:
      NODE_ENV: development
    ports:
      - ${port}:${port}
      - 9229:9229
    ${cmd}`;
        case 'go':
            return `version: '2.1'

services:
  ${serviceName}:
    image: ${serviceName}
    build:
      context: .
      dockerfile: Dockerfile
    ports:
        - ${port}:${port}
`;
        case '.net core console':
            // we don't generate compose files for .net core
            return `version: '2.1'

services:
  ${serviceName}:
    image: ${serviceName}
    build: .
    ports:
      - ${port}:${port}`;
        case 'asp.net core':
            // we don't generate compose files for .net core
            return `version: '2.1'

services:
  ${serviceName}:
    image: ${serviceName}
    build: .
    ports:
      - ${port}:${port}`;
        case 'python':
            return `version: '2.1'

services:
  ${serviceName}:
    image: ${serviceName}
    build:
      context: .
      dockerfile: Dockerfile
    ports:
        - ${port}:${port}
`;
        case 'ruby':
            return `version: '2.1'

services:
  ${serviceName}:
    image: ${serviceName}
    build:
      context: .
      dockerfile: Dockerfile
    ports:
        - ${port}:${port}
`;
        case 'java':
            return `version: '2.1'

services:
  ${serviceName}:
    image: ${serviceName}
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      JAVA_OPTS: -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005,quiet=y
    ports:
      - ${port}:${port}
      - 5005:5005
    `;
        default:
            return `version: '2.1'

services:
  ${serviceName}:
    image: ${serviceName}
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - ${port}:${port}
`;
    }
}
function genDockerIgnoreFile(service, platformType, os, port) {
    return `node_modules
npm-debug.log
Dockerfile*
docker-compose*
.dockerignore
.git
.gitignore
README.md
LICENSE
.vscode`;
}
function getPackageJson(folderPath) {
    return __awaiter(this, void 0, void 0, function* () {
        return vscode.workspace.findFiles(new vscode.RelativePattern(folderPath, 'package.json'), null, 1, null);
    });
}
function getDefaultPackageJson() {
    return {
        npmStart: true,
        fullCommand: 'npm start',
        cmd: 'npm start',
        author: 'author',
        version: '0.0.1',
        artifactName: ''
    };
}
function readPackageJson(folderPath) {
    return __awaiter(this, void 0, void 0, function* () {
        // open package.json and look for main, scripts start
        const uris = yield getPackageJson(folderPath);
        let pkg = getDefaultPackageJson(); //default
        if (uris && uris.length > 0) {
            const json = JSON.parse(fs.readFileSync(uris[0].fsPath, 'utf8'));
            if (json.scripts && json.scripts.start) {
                pkg.npmStart = true;
                pkg.fullCommand = json.scripts.start;
                pkg.cmd = 'npm start';
            }
            else if (json.main) {
                pkg.npmStart = false;
                pkg.fullCommand = 'node' + ' ' + json.main;
                pkg.cmd = pkg.fullCommand;
            }
            else {
                pkg.fullCommand = '';
            }
            if (json.author) {
                pkg.author = json.author;
            }
            if (json.version) {
                pkg.version = json.version;
            }
        }
        return pkg;
    });
}
function readPomOrGradle(folderPath) {
    return __awaiter(this, void 0, void 0, function* () {
        let pkg = getDefaultPackageJson(); //default
        if (fs.existsSync(path.join(folderPath, 'pom.xml'))) {
            let json = yield new Promise((resolve, reject) => {
                pomParser.parse({
                    filePath: path.join(folderPath, 'pom.xml')
                }, (error, response) => {
                    if (error) {
                        reject(`Failed to parse pom.xml: ${error}`);
                        return;
                    }
                    resolve(response.pomObject);
                });
            });
            json = json || {};
            if (json.project && json.project.version) {
                pkg.version = json.project.version;
            }
            if (json.project && json.project.artifactid) {
                pkg.artifactName = `target/${json.project.artifactid}-${pkg.version}.jar`;
            }
        }
        else if (fs.existsSync(path.join(folderPath, 'build.gradle'))) {
            const json = yield gradleParser.parseFile(path.join(folderPath, 'build.gradle'));
            if (json.jar && json.jar.version) {
                pkg.version = json.jar.version;
            }
            else if (json.version) {
                pkg.version = json.version;
            }
            if (json.jar && json.jar.archiveName) {
                pkg.artifactName = `build/libs/${json.jar.archiveName}`;
            }
            else {
                const baseName = json.jar && json.jar.baseName ? json.jar.baseName : json.archivesBaseName || path.basename(folderPath);
                pkg.artifactName = `build/libs/${baseName}-${pkg.version}.jar`;
            }
        }
        return pkg;
    });
}
// Returns the relative path of the project file without the extension
function findCSProjFile(folderPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const opt = {
            matchOnDescription: true,
            matchOnDetail: true,
            placeHolder: 'Select Project'
        };
        const projectFiles = yield async_1.globAsync('**/*.csproj', { cwd: folderPath });
        if (!projectFiles || !projectFiles.length) {
            throw new Error("No .csproj file could be found.");
        }
        if (projectFiles.length > 1) {
            let items = projectFiles.map(p => ({ label: p }));
            const res = yield extensionVariables_1.ext.ui.showQuickPick(items, opt);
            return res.label.slice(0, -'.csproj'.length);
        }
        return projectFiles[0].slice(0, -'.csproj'.length);
    });
}
const DOCKER_FILE_TYPES = {
    'docker-compose.yml': genDockerCompose,
    'docker-compose.debug.yml': genDockerComposeDebug,
    'Dockerfile': genDockerFile,
    '.dockerignore': genDockerIgnoreFile
};
const YES_OR_NO_PROMPT = [
    {
        "title": 'Yes',
        "isCloseAffordance": false
    },
    {
        "title": 'No',
        "isCloseAffordance": true
    }
];
function configure(folderPath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!folderPath) {
            let folder;
            if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length === 1) {
                folder = vscode.workspace.workspaceFolders[0];
            }
            else {
                folder = yield vscode.window.showWorkspaceFolderPick();
            }
            if (!folder) {
                if (!vscode.workspace.workspaceFolders) {
                    throw new Error('Docker files can only be generated if VS Code is opened on a folder.');
                }
                else {
                    throw new Error('Docker files can only be generated if a workspace folder is picked in VS Code.');
                }
            }
            folderPath = folder.uri.fsPath;
        }
        const platformType = yield config_utils_1.quickPickPlatform();
        let os;
        if (platformType.toLowerCase().includes('.net')) {
            os = yield config_utils_1.quickPickOS();
        }
        let port;
        if (platformType.toLowerCase().includes('.net')) {
            port = yield config_utils_1.promptForPort(80);
        }
        else {
            port = yield config_utils_1.promptForPort(3000);
        }
        let serviceName;
        if (platformType.toLowerCase().includes('.net')) {
            serviceName = yield findCSProjFile(folderPath);
        }
        else {
            serviceName = path.basename(folderPath).toLowerCase();
        }
        if (!serviceName) {
            return;
        }
        let pkg = getDefaultPackageJson();
        if (platformType.toLowerCase() === 'java') {
            pkg = yield readPomOrGradle(folderPath);
        }
        else {
            pkg = yield readPackageJson(folderPath);
        }
        yield Promise.all(Object.keys(DOCKER_FILE_TYPES).map((fileName) => __awaiter(this, void 0, void 0, function* () {
            if (platformType.toLowerCase().includes('.net') && fileName.includes('docker-compose')) {
                // don't generate docker-compose files for .NET Core apps
                return;
            }
            return createWorkspaceFileIfNotExists(fileName, DOCKER_FILE_TYPES[fileName]);
        })));
        if (telemetry_1.reporter) {
            /* __GDPR__
            "command" : {
                "command" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                "platformType": { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
            }
            */
            telemetry_1.reporter.sendTelemetryEvent('command', {
                command: 'vscode-docker.configure',
                platformType
            });
        }
        function createWorkspaceFileIfNotExists(fileName, generatorFunction) {
            return __awaiter(this, void 0, void 0, function* () {
                const workspacePath = path.join(folderPath, fileName);
                if (fs.existsSync(workspacePath)) {
                    const item = yield vscode.window.showErrorMessage(`A ${fileName} already exists. Would you like to override it?`, ...YES_OR_NO_PROMPT);
                    if (item.title.toLowerCase() === 'yes') {
                        fs.writeFileSync(workspacePath, generatorFunction(serviceName, platformType, os, port, pkg), { encoding: 'utf8' });
                    }
                }
                else {
                    fs.writeFileSync(workspacePath, generatorFunction(serviceName, platformType, os, port, pkg), { encoding: 'utf8' });
                }
            });
        }
    });
}
exports.configure = configure;
//# sourceMappingURL=configure.js.map