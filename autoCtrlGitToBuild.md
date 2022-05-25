```sh
git branch for_build_all_platfor
git checkout for_build_all_platform

npm run build_all_platform

git add .\update_for_windows.exe
git commit -m "🚀 pkg for update_for_windows"
git push --set-upstream origin for_build_all_platform

git add .\update_for_linux
git commit -m "🚀 pkg for update_for_linux"
git push --set-upstream origin for_build_all_platform

git add .\update_for_macos
git commit -m "🚀 pkg for update_for_macos"
git push --set-upstream origin for_build_all_platform

git checkout dev
git merge for_build_all_platform --no-ff -m "🔀 Merge branch 'for_build_all_platform' into dev"

git branch -d for_build_all_platform
```
