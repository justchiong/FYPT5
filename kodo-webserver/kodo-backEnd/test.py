import zipfile
import os
directory = "f8dd4207-0097-49a5-b82c-954524120f79"
parent_dir = os.path.dirname(os.path.realpath(__file__)) + "/webServer_Folders"


path = os.path.join(parent_dir, directory)
destPath = parent_dir + '/' + directory

# access = 0o777
# os.mkdir(path, access)
# print("Directory '% s' created" % directory)

# zipPath = os.path.dirname(os.path.realpath(__file__)) + "/zipFiles/" + "test.zip"
# with zipfile.ZipFile(zipPath, 'r') as zip_ref:
#      zip_ref.extractall(destPath)

import shutil
try:
    shutil.rmtree(destPath)
except OSError as e:
    print("Error: %s : %s" % (destPath, e.strerror))