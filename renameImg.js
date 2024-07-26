const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// введи новый номер если следующая секция
const sectionNumber = '1'; // номер блока
// делитель размера
const divider = 1; // стандарт 1

const renameSection = false; // если требуется изменить номер блока
const sectionNumberLast = '2-1' // старый номер блока

// Получаем ширину изображения
async function getImageWidth(filename) {
  const image = sharp(filename);
  const metadata = await image.metadata();
  return metadata.width;
}

function checkFileNameAvailability(filePath) {
    let suffix = 1;
    let newFilePath = filePath;
    const parsedPath = path.parse(filePath);
    let newFileName = 'error.png';
    if(renameSection) {
        newFilename = `${parsedPath.name.replace(`section${sectionNumberLast}`,`section${sectionNumber}`)}.png`;
    }
    while (fs.existsSync(newFilePath)) {
        newFileName = `${parsedPath.name.replace(`section${sectionNumber}`,`section${sectionNumber}d${suffix}`)}${parsedPath.ext}`;

        newFilePath = path.join(parsedPath.dir, newFileName);
        suffix++;
    }
    return newFilePath;
  }

async function renameFileByWidth(inputPath, outputPath) {
  try {
    const width = await getImageWidth(inputPath);
    const filename = path.basename(inputPath);
    console.log(width);
    if (filename.includes('@2x')) {
        if (1204 / divider > width && width >= 1098 / divider) {
          newFilename = `section${sectionNumber}-1440@2x.png`;
        } else if (1000 / divider > width && width >= 920 / divider) {
          newFilename = `section${sectionNumber}-1024@2x.png`;
        } else if (644 / divider > width && width >= 500 / divider) {
          newFilename = `section${sectionNumber}-320@2x.png`;
        } else {
          newFilename = `section${sectionNumber}-768@2x.png`;
        }
      } else {
        if (602 / divider > width && width >= 559 / divider) {
          newFilename = `section${sectionNumber}-1440.png`;
        } else if (500 / divider > width && width >= 460 / divider) {
          newFilename = `section${sectionNumber}-1024.png`;
        } else if (322 > width && width >= 250) {
          newFilename = `section${sectionNumber}-320.png`;
        } else {
          newFilename = `section${sectionNumber}-768.png`;
        }
      }
      const newFilePath = checkFileNameAvailability(path.join(outputPath, newFilename));

    fs.renameSync(inputPath, newFilePath);
    console.log(`Файл ${path.basename(inputPath)} успешно переименован в ${newFilename}`);
  } catch (error) {
    console.error(`Ошибка при переименовании файла ${path.basename(inputPath)}:`, error);
  }
}

// путь к изображениям
const inputFolderPath = 'static/images-new/';

// путь куда сохранять
const outputFolderPath = 'static/images-new/';

// Создание папки для сохранения переименованных файлов, если она еще не существует
if (!fs.existsSync(outputFolderPath)) {
  fs.mkdirSync(outputFolderPath);
}

fs.readdirSync(inputFolderPath).forEach((file) => {
  const inputFilePath = path.join(inputFolderPath, file);
  renameFileByWidth(inputFilePath, outputFolderPath);
}); 