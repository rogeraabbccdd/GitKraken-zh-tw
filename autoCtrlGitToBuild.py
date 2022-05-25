import os
from time import sleep

os.system(r'git branch for_build_all_platfor')
os.system(r'git checkout for_build_all_platfor')

os.system(r'npm run build_all_platform')
sleep(1)

os.system(r'npm add .\update_for_windows.exe')
os.system(r'git commit -m "🚀 pkg for update_for_windows"')
os.system(r'git push --set-upstream origin for_build_all_platform')

os.system(r'git add .\update_for_linux')
os.system(r'git commit -m "🚀 pkg for update_for_linux"')
os.system(r'git push --set-upstream origin for_build_all_platform')

os.system(r'git add .\update_for_macos')
os.system(r'git commit -m "🚀 pkg for update_for_macos"')
os.system(r'git push --set-upstream origin for_build_all_platform')

os.system(r'git checkout dev')
command = ("git merge for_build_all_platform --no-ff -m " +
           "🔀 Merge branch 'for_build_all_platform' into dev")
os.system(command)

os.system(r'git branch -d for_build_all_platform')
