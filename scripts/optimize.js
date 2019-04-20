const sharp = require(`sharp`)
const glob = require(`glob`)
var gulp = require('gulp');
const fs = require(`fs-extra`)
const compress_images = require('compress-images');

const matches = glob.sync(`src/img/**/*.{png,jpg,jpeg}`)
const MAX_WIDTH = 1800
const QUALITY = 85


compress_images('src/img/**/*.{jpg,JPG,jpeg,JPEG,png,svg,gif}', 'build/img/', {compress_force: false, statistic: true, autoupdate: true}, false,
                                                    {jpg: {engine: 'jpegtran', command: ['-trim', '-progressive', '-copy', 'none', '-optimize']}},
                                                    {png: {engine: 'pngquant', command: ['--quality=20-50']}},
                                                    {svg: {engine: 'svgo', command: '--multipass'}},
                                                    {gif: {engine: 'gifsicle', command: ['--colors', '64', '--use-col=web']}}, function(err, completed){
                if(completed === true){
                    // Doing something.
                }
        });

Promise.all(
  matches.map(async match => {
    const stream = sharp(match)
    const info = await stream.metadata()

    if (info.width < MAX_WIDTH) {
      return
    }

    const optimizedName = match.replace(
      /(\..+)$/,
      (match, ext) => `-optimized${ext}`
    )

    await stream
      .resize(MAX_WIDTH)
      .jpeg({ quality: QUALITY })
      .toFile(optimizedName)

    return fs.rename(optimizedName, match)
  })
)
