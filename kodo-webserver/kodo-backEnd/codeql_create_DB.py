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

process1= subprocess.run(filePath, shell=True, stdout=subprocess.PIPE, text=True, stderr=subprocess.PIPE, cwd="./kodo-webserver/kodo-backEnd/zipFiles")

# print(process1.returncode)
# print(process1.stderr)
# print(process1.stdout)
