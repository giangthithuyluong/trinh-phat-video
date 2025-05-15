import fs from 'fs'

const dir = './mp4'
const fileExtension = 'mp4'

var json = []

fs.readdir(dir, (err, files) => {
    json = files.map(file => {
        return {
            name: file.split('.')[0],
            author: file.split(' - ')[0],
            link: './acess/mp4/'+file,
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis sed, reprehenderit quisquam quos tempore expedita inventore nihil placeat ipsum odit natus laboriosam impedit hic, saepe, aliquam commodi fugiat quas error?"
        }
    })
    console.log(json)
})