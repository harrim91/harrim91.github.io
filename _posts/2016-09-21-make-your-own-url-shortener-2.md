---
layout: post
title: "TDD your own URL Shortener: Saving shortened URL's"
date: 2016-08-22 12:00:00 +0000
tags: ruby, sinatra, tutorial, mvc, tdd, database, postgreSQL
published: true
---

In [Part 1](/2016/08/21/make-your-own-url-shortener-1.html) of this tutorial, we covered setting up a basic web application with Sinatra, using [RSpec](https://www.relishapp.com/rspec) and [Capybara](https://github.com/jnicklas/capybara) to test.

As a refresher, we want to create a web application that does the following:

- Takes a long URL and generates a short URL, storing the short URL and long URL together in a persistant data store.
- Redirects users to the long URL when the short URL is visited.
- Does not allow users to submit an invalid URL
- Checks if the URL has already been stored and does not create duplicate entries.

In this part, we're going to write out some feature tests that will allow us to test-drive the first one of those requirements.

We're also going to look at the MVC architectural pattern, which is popular for designing web applications.

## MVC

MVC stands for Model-View-Controller. This architecture breaks your application into layers, which each have separate concerns. It also just makes your code more organised and managable.

 - The **Model** layer holds all of your application logic and data. I guess it's ultimately responsible for solving whatever problem you're trying to solve, and is probably the main piece of your application. It's not concerned with where the data comes from, who it gets shown to, or how it gets shown to them.

 - The **View** layer represents data to the client, in whatever way you see fit to do so. It isn't concerned with how the data is structured or stored, it just wants the data so it can manipulate it and represent it.

 - The **Controller** layer is sort of like the middle-man. In its middle-man role, it creates a clear separation between the logic layer of the application (the model) and the presentational layer (the view). But beyond this, it it also where you *control* the flow of data through your application. It is responsible for handling the passing of messages between the model and the view.

 Hopefully that gives some high level explanation of the architecture we're aiming for, what each layer does, and how it allows for a separation of concerns in our code. Hopefully it will also become clearer as we actually build the application. 

## Saving a URL

First off, we're going to write a feature test for the, umm, feature. Feature tests are high-level tests that basically describe the expected behavior of the application when the user interacts with it. So create a new file at `/spec/features/submitting_url_spec.rb` with the following code:

<figure>
	<figcaption>/spec/features/submitting_url_spec.rb</figcaption>
	{% highlight ruby %}
  feature 'Submitting URL' do
    it 'saves the URL' do
      visit '/'
      within 'form#form-url' do
        fill_in :'field-url', with: 'http://www.google.com'
        expect{ click_button 'Shorten URL' }.to change(ShortURL, :count).by 1
      end
    end
  end
	{% endhighlight %}
</figure>

This is basically saying when we visit our homepage, there should be a form, which when we enter a URL (e.g. http://www.google.com), and click Shorten URL, then the number of ShortURL's in our database should increase by 1.

If we run `$ rpec`, then ... Ahh! A failed test! That can't be good!

Don't worry. At this stage, you should only be worrying if the test passed. You haven't even written any code yet.

The error message should say that we don't have a form with an ID of "form-url".

```
  Capybara::ElementNotFound:
    Unable to find css "form#form-url"
```
That makes sense. So to fix it, we're obviously gonna have to make a form.

### Creating a view

To do this, I'm gonna use [HAML](http://http://haml.info/), which is a nice markup language for writing HTML templates.

First we're gonna have to install HAML, which is as simple as adding `gem 'haml'` to our Gemfile and running `$ bundle`.

Now we have to make a `views/index.haml` file, which will be the homepage for our application, containing the following code:

<figure>
	<figcaption>/app/views/index.haml</figcaption>
	{% highlight ruby %}
!!!
%html
  %head
    %title URL Shortener
  %body
    %h1= 'URL Shortener'
    %form{ id: "form-url" }
      %input{ type: "text", id: "field-url" }
      %input{ type: "submit", id: "btn-submit-url", value: "Shorten URL" }
  {% endhighlight %}
</figure>

This is a HTML page with a header and a form containing all of the components we've specified in our test. So what happens if we run `$ rspec` again?

Aghh! The same error! Let's take a look at the application ourselves, to see what's actually happening. Run `$ shotgun` and then visit `localhost:9393` in your browser. You should just see a basic greeting message on the screen. 

### Controller Logic - Rendering a View

If you look at `app.rb`, you can see the following code that was automatically generated when we set up the application:

<figure>
	<figcaption>app.rb</figcaption>
	{% highlight ruby %}
...
  get '/' do
    'Hello URLShortener!'
  end
...
  {% endhighlight %}
</figure>

This is an _application route_: It tells our application how to deal with a particular [HTTP request](https://code.tutsplus.com/tutorials/http-the-protocol-every-web-developer-must-know-part-1--net-31177). This is part of the controller layer of our application.

In this case, it tells our application that when it receives a GET request made to the '/' path, it should return the string 'Hello URLShortener' to the client. And that's exactly what's happened.

What we want to happen, however, is for the application to respond with the HAML file we created earlier.

To do that, we need to tell the application to return that file, and that the file in question should be rendered as HAML:

<figure>
  <figcaption>app.rb</figcaption>
  {% highlight ruby %}
...
  get '/' do
    haml :index
  end
...
  {% endhighlight %}
</figure>

If you run `$ shotgun` again, you should see the form being rendered. It's not very pretty, but it's there.

Sinatra supports a number of templating engines like HAML, and by default it looks for a `views` directory to find the file to render. In this case, we've just told it to look in our `app/views` directory for a HAML file called `index`.

Run `$ rspec` again, and lets see what happens...You shold get another error message, reading something like this:

```
Failure/Error: expect{ click_button 'Shorten URL' }.to change(ShortURL, :count).by 1

 NameError:
   uninitialized constant ShortURL
```

What's all that about then?

### Defining a model