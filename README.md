# fiu-socket

1. Go some workspace you would setup this development environement and clone git repository.

        $ git clone git@github.com:bluewhaleappsinc/fiu-socket.git
        $ cd fiu-socket

2. Install [Node.js](http://nodejs.org/). If you have installed nodejs then you need to skip this step

3. Install forever library to keep node server running

        $ npm install -g forever

4. Start socket using forever

        $ forever start -l forever.log -o out.log -e err.log server.js

5. If you need to re-start server then you have to follow below command:

        $ forever stop server.js 
        $ rm -rf ~/.forever/forever.log err.log out.log
        $ forever start -l forever.log -o out.log -e err.log server.js