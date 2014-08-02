This example program synchronizes text in a textarea between many clients.

It uses a synchronization algorithm that simply sends the full text to every client (including the originating client) each time it changes on either client. This results in "last one wins" handling of simultaneous changes in both clients.

Originally from the [Overseer project](https://github.com/curran/overseer)
Curran Kelleher August 2014
