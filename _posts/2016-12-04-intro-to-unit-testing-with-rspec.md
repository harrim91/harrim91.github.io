---
layout: post
title: "Intro to RSpec"
date: 2016-12-04 16:00:00 +0000
tags: ruby, rspec, tutorial, tdd, bdd
published: false
---

RSpec is a testing framework for the Ruby programming language, designed to aid behavior-driven development (BDD). 

BDD is an extension of TDD which focuses on specifying the behaviour of the public interface of your software, and testing against this. It's basically a way of thinking about testing, and a set of conventions and rules to avoid some common pitfalls whilst doing TDD. 

In this [amazingly tidy blog post](https://dannorth.net/introducing-bdd/), Dan North (the guy who came up with BDD), he explains what these pitfalls are, and how BDD solves them. He also introduces some of the conventions used in BDD, such as using full sentences for test names, and the GIVEN/WHEN/THEN structure for acceptance tests.

Give it a quick read before we get started.

RSpec is just a tool that lets you do BDD. It's syntax is very similar to other BDD frameworks in other languages (such as Jasmine, or Mocha/Chai in JavaScript). They all allow you to write focused unit tests that describe the behaviours of your code, and can act as documentation for it.

In this post I'm going to introduce some of the basic features.

First up, lets get it installed. To install RSpec globally, in your command line, run `gem install rspec`. If you're working on a project that you want to include RSpec in, then add `rspec` to your Gemfile and run `bundle install`.

Once that's done, in your project directory, run `rspec --init`.