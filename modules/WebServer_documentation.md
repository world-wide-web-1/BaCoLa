# HTTP Web Server Documentation

- [Server Instance(s)](#server_instance_s_)
- [Request Methods](#request_methods)
  - [GET](#get)
  - [POST](#post)
  - [PUT](#put)
  - [PATCH](#patch)
  - [DELETE](#delete)
- [Handling Other Requests](#handling_other_requests)
  - [Handling by Status](#handling_by_status)
  - [Handling any Request](#handling_any_request)
- [Starting a Server](#starting_a_server)

# <p id="server_instance_s_"></p>Server Instance(s)
> To get a server started, you must use the `server` function in a variable.\
> The reason why it is in a variable is that it will be referred in other parts of the script, it also makes you able to run multiple servers in one script.
> ```
> server
> ```
> Example:
> ```
> WebServer = server. // Put the "server" function in a variable
> ```
# <p id="request_methods"></p>Request Methods
> ### <p id="get"></p>GET
> > A GET request can be handled by the `get` function.
> > ```
> > get <server> = <MIMEType: string> (
> >   <data>
> > ) => <URL: string>
> > ```
> > Building off of the first example:
> > ```
> > get WebServer = "text/plain" (
> >   Hello, World!
> > ) => "/"
> > ```
> ### <p id="post"></p>POST
> > A POST request can be handled by the `post` function.
> > ```
> > post <server> = <MIMEType: string> (
> >   <data>
> > ) => <URL: string>
> > ```
> > Building off of the first example:
> > ```
> > post WebServer = "text/plain" (
> >   Hello, World!
> > ) => "/"
> > ```
> ### <p id="put"></p>PUT
> > A PUT request can be handled by the `put` function.
> > ```
> > put <server> = <MIMEType: string> (
> >   <data>
> > ) => <URL: string>
> > ```
> > Building off of the first example:
> > ```
> > put WebServer = "text/plain" (
> >   Hello, World!
> > ) => "/"
> > ```
> ### <p id="patch"></p>PATCH
> > A PATCH request can be handled by the `patch` function.
> > ```
> > patch <server> = <MIMEType: string> (
> >   <data>
> > ) => <URL: string>
> > ```
> > Building off of the first example:
> > ```
> > patch WebServer = "text/plain" (
> >   Hello, World!
> > ) => "/"
> > ```
> ### <p id="delete"></p>DELETE
> > A DELETE request can be handled by the `delete` function.
> > ```
> > delete <server> = <MIMEType: string> (
> >   <data>
> > ) => <URL: string>
> > ```
> > Building off of the first example:
> > ```
> > delete WebServer = "text/plain" (
> >   Hello, World!
> > ) => "/"
> > ```
# <p id="handling_other_requests"></p>Handling Other Requests
> ### <p id="handling_by_status"></p>Handling by Status
> > A request with a certain status can be handled with the `status` function.
> > ```
> > status <server> = <MIMEType: string> (
> >   <data>
> > ) => <Status: number>
> > ```
> > Building off of the first example:
> > ```
> > status WebServer = "text/plain" (
> >   The page you are looking for couldn't be found!
> > ) => #404#
> > ```
> ### <p id="handling_any_request"></p>Handling any Request
> > Any request can be handled by the `route` function.
> > ```
> > route <server> = <MIMEType: string> (
> >   <data>
> > ) => <URL: string>
> > ```
> > Building off of the first example:
> > ```
> > route WebServer = "text/plain" (
> >   Hello, World!
> > ) => "/"
> > ```
# <p id="starting_a_server"></p>Starting a Server
> To start a server, you must use the `start` function.
> ```
> start <server> = <port: number>.
> ```
> Again, building off of the first example:
> ```
> start WebServer = #80#.
> ```