# What / Why?

This project is a static site generator. It's main purpose is to be used for rapid prototyping and idea-generation. The project leverages Webpack and is packed with features such as: Babel, Handlebars, Sass, etc.

---

## Concepts

Check out the special conventions for this project below.

### Pages 

Pages are "first-class citizens" of the project and can be considered as separate modules that are completely independent from one another. 

The pages must reside in `src/pages/`. Each page is also required to contain a Handlebars template, a js file and a styles file *named after that specific page*.

Additionally, every page is provided with global styles and scripts from `src/global.scss` and `src/global.js`.

Please note, that `pages/home/` dir and all of it's contents will be output to `dist/` with the name "index" instead of "home". This is done to make home page accessible from the root url.

### Partials & Helpers

`src/helpers/` and `src/partials/` directories, surprisingly enough, contain helpers and partials that are directly accessible from every page. Example:

```handlebars
<!-- "json" helper placed inside `src/helpers` -->
<pre>{{ json someObject }}</pre>

<!-- "footer.hbs" partial placed inside `src/partials` -->
<div>
  {{> 'footer' }}
</div>
```

Please note, that helpers and partials, which are placed outside of these directories, should be referenced with relative paths. Example:

```html
<!-- "sidebar.hbs" partial placed *outside* `src/partials` -->
<div>
  {{> '../../sidebar' }}
</div>
```

### Static Files

All of the static assets like images, fonts, etc. must be placed into the `/static/` directory. Then they can be referenced like following:

```html
<img src="/static/example-image.png" />
```

---

## Dev & Build

1. Clone the project
2. Navigate into the directory and run `npm install`

To launch the project in dev mode, run: 

```bash
npm run start
```

To build it, run:

```bash
npm run build
```
