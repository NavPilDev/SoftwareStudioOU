# Sanity Clean Content Studio

Congratulations, you have now installed the Sanity Content Studio, an open-source real-time content editing environment connected to the Sanity backend.

Now you can do the following things:

- [Read “getting started” in the docs](https://www.sanity.io/docs/introduction/getting-started?utm_source=readme)
- [Join the Sanity community](https://www.sanity.io/community/join?utm_source=readme)
- [Extend and build plugins](https://www.sanity.io/docs/content-studio/extending?utm_source=readme)

## Projects: `year` + `batch` migration notes

The `project` schema uses:

- `year` as a **number** (example: `2026`)
- `batch` as **Spring** or **Fall**

If you had existing projects before this change, you must update those documents in Sanity Studio:

1. Open each `Project` document.
2. Set `batch` to `Spring` or `Fall`.
3. Publish the document.

After publishing, the website’s Projects page will group projects by `year` and use `batch` to determine the next “Join us” semester range in the `+` tab.
