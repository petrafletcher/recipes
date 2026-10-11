# recipes

A static recipe site built with [Hugo](https://gohugo.io/). Each recipe is a folder in `content/recipes/` containing an `index.md` and, optionally, a photo. The home page searches across titles, descriptions, ingredients and labels, and you can filter by combining labels.

## Run it locally

Install Hugo (extended edition) once:

```powershell
winget install Hugo.Hugo.Extended
```

Then, from this folder:

```powershell
hugo server
```

Open http://localhost:1313. The page reloads as you edit files.

## Add a recipe

```powershell
hugo new content recipes/my-new-recipe
```

This creates `content/recipes/my-new-recipe/index.md` from `archetypes/recipes/index.md`. Fill in the front matter:

```yaml
---
title: "Hunters Chicken"
description: "One or two sentences shown on the card and at the top of the page."
source: "Don't Go Bacon My Heart"          # who wrote the original
source_url: "https://…"                    # link for the full method
prep_time: 5                               # minutes
cook_time: 30                              # minutes
total_time: 35                             # minutes
servings: "4"
labels: [british, main, chicken, oven, quick]
ingredients:                               # either a flat list…
  - "4 chicken breasts"
  - "12 slices of streaky bacon"
---

Anything written here appears under "Notes".
```

You can also group ingredients:

```yaml
ingredients:
  - group: "Sauce"
    items:
      - "2 tbsp butter"
      - "1 onion, chopped"
  - group: "Chicken"
    items:
      - "4 chicken breasts"
```

Every field except `title` is optional.

### Photos

Each recipe shows the first photo it finds, in this order:

1. **Your own photo:** a file named `cover.jpg` (or `cover.png` / `cover.webp`) in the recipe's folder. Hugo crops and resizes it into WebP automatically.
2. **The original author's photo:** an `image:` URL in the front matter. This is the preview image the recipe site publishes for link sharing (its `og:image`), shown straight from the author's site and credited under the photo. Nothing is copied into this repo, so if the author changes or removes the image, the placeholder shows instead.
3. **A plain placeholder.**

```yaml
image: "https://www.dontgobaconmyheart.co.uk/wp-content/uploads/2022/03/hunters-chicken.jpg"
```

To find the URL, open the recipe page, view the source, and search for `og:image`.

If you add a `cover.*` photo that isn't yours (for example a freely licensed one), credit it in the front matter and the credit appears under the photo:

```yaml
photo:
  author: "Jane Smith"
  license: "CC BY-SA 4.0"
  license_url: "https://creativecommons.org/licenses/by-sa/4.0/"
  source: "https://commons.wikimedia.org/wiki/File:…"
```

Don't download photos from recipe websites into the repo. They belong to their authors, and this site is public. Use the `image:` link instead.

### Labels

Labels are lowercase words with hyphens instead of spaces. Each new label gets its own page at `/labels/<label>/` automatically. These are the labels in use so far:

| Kind            | Labels                                                                     |
| --------------- | -------------------------------------------------------------------------- |
| Cuisine         | american, british, chinese, indian, italian, japanese, turkish             |
| Course          | main, side, sauce, bread, snack                                            |
| Main ingredient | chicken, pork, beef, vegetarian                                            |
| Method          | oven, stovetop, slow-cooker, fry, bbq, roast, no-cook                      |
| Other           | christmas, curry, family-friendly, make-ahead, quick, spicy, takeaway-style |

## Search

The home page filters the recipe cards in the browser, with no server or database. Search text must match every word you type. Selecting several labels shows recipes that have all of them. The number on each label shows how many recipes you'd get by adding it. Searches are kept in the URL, e.g. `/?labels=indian,chicken&q=cream`, so you can bookmark them.

## Deploy to GitHub Pages

The workflow in `.github/workflows/pages.yml` builds the site and publishes it on every push to `main`.

1. Push this repository to GitHub.
2. In the repository go to **Settings → Pages**, and under **Build and deployment → Source** choose **GitHub Actions**.
3. Push to `main`, or run the workflow by hand from the **Actions** tab.

The site appears at `https://<your-username>.github.io/<repository-name>/`. The workflow sets the correct base address automatically, including for a custom domain.

GitHub Pages sites are public, even when the repository is private.

To link to another recipe from a recipe's notes, use `relref` so the link works under any base address:

```markdown
Serve with [butter naan]({{< relref "recipes/butter-naan" >}}).
```

## Layout

```
.github/workflows/      GitHub Pages build and deploy
archetypes/recipes/     template for `hugo new content recipes/…`
assets/css/main.css     styles (light and dark mode)
assets/js/search.js     home page search and label filtering
content/recipes/<name>/ one folder per recipe: index.md + cover photo
static/                 files copied as-is (favicon)
layouts/                page templates (no external theme)
hugo.toml               site configuration
```
