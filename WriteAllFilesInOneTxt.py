import os

def read_files_and_write_to_one(input_folder, output_file):
    with open(output_file, 'w', encoding='utf-8') as outfile:
        for dirpath, dirnames, filenames in os.walk(input_folder):
            for filename in filenames:
                # Проверяем, является ли файл текстовым (например, .txt)
                if True:
                    file_path = os.path.join(dirpath, filename)
                    relative_path = os.path.relpath(file_path, input_folder)  # Получаем относительный путь
                    outfile.write(f'--- {relative_path} ---\n')  # Записываем относительный путь файла
                    try:
                        with open(file_path, 'r', encoding='utf-8') as infile:
                            content = infile.read()
                            outfile.write(content + '\n\n')  # Записываем содержимое файла
                    except Exception as e:
                        print(f'Ошибка при чтении файла {file_path}: {e}')

input_folder = r'life'  # Используем сырую строку
output_file = 'output.txt'
read_files_and_write_to_one(input_folder, output_file)
print("End")
