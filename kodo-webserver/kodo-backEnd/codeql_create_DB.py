import subprocess
import zipfile
import sys
import zipfile
import os
# .stout for output
# .stderr for printing err in python terminal
# .args for the list of arguments used
# .returncode '0' means no error
# cwd argument to change working directory

# get the folder name and put in this variable to create DB of it

directory = sys.argv[1]
parent_dir = os.path.dirname(os.path.realpath(__file__)) + "/webServer_Folders"


path = os.path.join(parent_dir, directory)
destPath = parent_dir + '/' + directory

os.mkdir(path)
print("Directory '% s' created" % directory)

zipPath = os.path.dirname(os.path.realpath(__file__)) + "/zipFiles/" + directory +".zip"
with zipfile.ZipFile(zipPath, 'r') as zip_ref:
     zip_ref.extractall(destPath)

cmd = f"codeql database create ./kodo-backEnd/databases/{directory}_db --source-root=./kodo-backEnd/webServer_Folders/{directory} --language=javascript"
process1= subprocess.run(cmd, shell=True, stdout=subprocess.PIPE, text=True, stderr=subprocess.PIPE)
print(process1.returncode)
print(process1.stderr)
print(process1.stdout)
print("CodeQL Database Created.")
# print(process1.returncode)
# print(process1.stderr)
# print(process1.stdout)
