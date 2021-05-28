import os
import shutil
import stat
directory = "5d413aae-2c2d-42ab-b149-b5a90eee2867"
parent_dir = os.path.dirname(os.path.realpath(__file__)) + "\\webServer_Folders"

db_dir = os.path.dirname(os.path.realpath(__file__)) + "\\databases"

zip_dir = os.path.dirname(os.path.realpath(__file__)) + "\\zipFiles"
zipath = zip_dir + '\\' + directory + ".zip"

path = os.path.join(parent_dir, directory)
destPath = parent_dir + '\\' + directory
dbPath = db_dir + '\\' + directory + "_db"
def remove_readonly(func, path, _):
    "Clear the readonly bit and reattempt the removal"
    os.chmod(path, stat.S_IWRITE)
    func(path)

i = 0
while i <=2:
    if i == 0:
        if os.path.exists(zipath):
         pathe = zipath

         os.remove(pathe)
    elif i<=1:
        pathe=dbPath
    else:
        pathe = destPath
    if i!=0:
        realpath = pathe
        pathe = "\\\\?\\" + pathe
        pathe = pathe.replace('/', '\\')
        while os.path.exists(realpath):
            try:
                shutil.rmtree(pathe, onerror = remove_readonly)
            except OSError as e:
                pass
    i += 1