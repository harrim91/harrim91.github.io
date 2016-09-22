---
layout: post
title: "TDD your own URL Shortener: Saving shortened URL's"
date: 2016-08-22 12:00:00 +0000
tags: ruby, sinatra, tutorial, mvc, tdd
published: true
---

In [Part 1](/2016/08/21/make-your-own-url-shortener-1.html) of this tutorial, we covered setting up a basic web application with Sinatra, using [RSpec](https://www.relishapp.com/rspec) and [Capybara](https://github.com/jnicklas/capybara) to test.

In this part, we're going to write out some feature tests from the requirements that were outlined in the first part of the tutorial. As a refresher, we want to create a web application that does the following:

- Takes a long URL and generates a short URL, storing the short URL and long URL together in a persistant data store.
- Redirects users to the long URL when the short URL is visited.
- Does not allow users to submit an invalid URL
- Checks if the URL has already been stored and does not create duplicate entries.

## Returning a short URL

First off, we're going to write a feature test for the, umm, feature. This basically describes the expected behavior of the application when the user interacts with it. So create a new file at `/spec/features/submitting_url_spec.rb` with the following code:

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