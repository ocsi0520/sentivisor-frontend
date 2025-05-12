TODO:
- proper title
- localization for SidePanel
- localization should be in consent as well, but that was out of scope
- other than that just build it


In order to build everything first you have to go to src/SidePanel folder
and generate the locale files with: `npx lit-localize build`.

In case you'd like to add/modify/remove localized texts, then (still in src/SidePanel):
1. Write in the terminal: `npx lit-localize extract`.
2. hu.xlf file is generated, there you can edit it by adding <target>translated text</target> for each record.
3. After you are done write in the terminal `npx lit-localize build`.
4. You are done :)

For more information:
- [Official Localization docs from lit](https://lit.dev/docs/localization/overview/)
- [Official docs for Runtime localization mode from lit](https://lit.dev/docs/localization/runtime-mode/)