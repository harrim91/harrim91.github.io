---
layout: post
title: "TDD your own URL Shortener with Sinatra"
date: 2016-08-21 16:00:00 +0000
tags: ruby, sinatra, tutorial, mvc, tdd
published: true
---

Over the last month or so, my life has been filled with tutorials and technical tests. So in this blog post, I'm going to combine the two and write a tutorial based on a practice tech test I was given by the careers team at [Makers Academy](http://www.makersacademy.com).

## The Task

_"Life is way too short to type out entire URLs . No-one on the internet has ever come up with a sane way of shortening URLs, especially not bit.ly, goo.gl or anything similar. Therefore, we want you to build your very own URL shortener and disrupt this 10x growth market."_

## The Plan

In this blog post, we're going to create a web application that does the following:

* Takes a long URL and generates a short URL, storing the short URL and long URL together in a persistant data store.
* Redirects users to the long URL when the short URL is visited.
* Does not allow users to submit an invalid URL
* Checks if the URL has already been stored and does not create duplicate entries.

I've been working with JS a lot recently, particularly Node, but I decided to do this using Ruby, and the [Sinatra](https://github.com/sinatra/sinatra) web framework.

There are a number of reasons for this.

First, this post is intended as an introduction to building web applications using the TDD and the MVC architectural pattern. I think for these purposes, Ruby is easier to read and write and test than JavaScript, and easier to configure than Node. We'll cut to the juicy important stuff faster, and spend less time worrying about the code, and more about what it's doing.

Second, I didn't want to use Rails, as this is only going to be a simple application and Rails felt like overkill. Also, whereas Node requires too much configuration, for the purposes of learning, I think Rails takes too much out of our hands. Rails magic is nice when you know what it's doing, but it assumes that you already understand it's conventions. If you're new to MVC, then Sinatra is better to learn with.

## Setting up

First off, you're going to need to create a new directory for the project. Then, as with any Ruby project, the first thing we're going to want to do is set up a Gemfile to manage our dependencies. Assuming you've already got Ruby and Bundler installed, run `$ bundle init`

Inside of the Gemfile that gets created, we want to set the Ruby version, and install Sinatra and our test frameworks.

<figure>
	<figcaption>Gemfile</figcaption>
	{% highlight ruby %}
source 'https://rubygems.org'

ruby '2.3.1'

gem 'sinatra'

group :development do
  gem 'shotgun'
end

group :test do
  gem 'capybara'
  gem 'rspec'
  gem 'rspec-sinatra'
  gem 'selenium-webdriver'
end
	{% endhighlight %}
</figure>

We're going to use [RSpec](https://www.relishapp.com/rspec) as our test framework, and use [Capybara](https://github.com/jnicklas/capybara) with [Selenium WebDriver](https://rubygems.org/gems/selenium-webdriver) to run our feature tests.

I also want to install [Shotgun](https://github.com/rtomayko/shotgun), which allows you to keep a server running without having to manually restart whenever you change a file.

Run `$ bundle install` to install all of that.

With everything now installed, we can generate a lot of the files we need to get started via the rspec-sinatra gem. Run `$ rspec-sinatra init --app URLShortener app/app.rb`

This should generate a number of files:

- `app/app.rb` - this is the main entry point for our application
- `spec/spec_helper.rb` - this is used to configure rspec
- `config.ru` - this is used to start our server

We also want to create a `.rspec` file, which give us some more config options for rspec, including formatting the output.

<figure>
	<figcaption>.rspec</figcaption>
	{% highlight plaintext %}
--color -fd
--require spec_helper
	{% endhighlight %}
</figure>

So now, our file tree should look like this:

<figure>
	{% highlight sh %}
$ tree
.
├── Gemfile
├── Gemfile.lock
├── app
│   └── app.rb
├── config.ru
└── spec
    └── spec_helper.rb
	{% endhighlight %}
</figure>

If we run `$ shotgun`, then you should see the server start up. If you visit [localhost:9393](http://localhost:9393) in the browser, you should see a nice message from your app.

Now we're all set up and ready to write some feature tests.