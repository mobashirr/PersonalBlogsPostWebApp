const path = require('path');
const fs = require('fs').promises; // Use promises API

class BlogModel {
    static StorageDict = path.join(__dirname, 'blogs'); // Static property

    constructor(Title, Content) {
        this.Title = Title;
        this.Content = Content;
        const now = new Date();
        this.CreatedAt = now;
        this.UpdatedAt = now;
    }

    setId(Id){
        if (!isNaN(Id))
            this.id = parseInt(Id)
    }
    static async Create(Title,Content){
        const Instance = new BlogModel(Title, Content);
        const Id = await BlogModel.getNextId();
        Instance.setId(Id);
        // console.log(Instance.toDict())
        return Instance;
    }
    static createBlogFilePath(id){
        const fileName = `blog${id}.json`;
        const blogPath = path.join(BlogModel.StorageDict, fileName);
        console.log(`blog's file path made ${fileName}`);
        return blogPath;
    }
    static async getBlogById(Id){

        console.log(`Searching for blog with id ${Id} ..`);
        const blogFilePath = BlogModel.createBlogFilePath(Id);
        console.log(blogFilePath)
        try{
                const fileContent = await fs.readFile(blogFilePath);
                const blog = JSON.parse(fileContent);
                console.log(`The blog foud has an id = ${blog.id}.`);
                return BlogModel.FromDict(blog);
        } catch{
            console.log(`blog not found.`)
            return null;
        }
    }

    static async getAllBlogs(){
        console.log(`query all blogs ..`);
        const data =  await BlogModel.readStorageDirectoryFiles();
        let blogs = [];
        if(data){
            for(const blog of Object.keys(data)){
                const fileName = blog.split('.')[0];
                // console.log(fileName);
                if(data[blog].type == 'json' && /^blog\d+$/.test(fileName) )
                    blogs.push(data[blog].BlogObject)
            }
            console.log(`blog/s found and sent to the client.`)
            return blogs;
        } else{
            console.log(`No blog found.`)
            return []
        }
        
    }
    static async getNextId() {

        console.log(`Creating an Id for new blog...`)
        let ind = await BlogModel.getNumberOfBlogs();
        let notExist = true;

        ind += 1;
        let filePath = `blog${ind}`;

        while(notExist){
            filePath = `blog${ind}`;
            try{
                await fs.access(filePath);
                // if file exist then the id is not available
                ind += 1
            } catch {
                notExist = false;
            }
        }
        console.log(`the id ${ind} as available.`)
        return ind;
    }

    static async getNumberOfBlogs(){
        console.log(`Getting Number of blogs in the storage ...`)
        const storageFolderFiles = await fs.readdir(this.StorageDict);
        console.log(`there is ${storageFolderFiles.length} blog.`)
        return storageFolderFiles.length
    }
    static async readStorageDirectoryFiles() {

        console.log(`try to upload blgos from the storage..`)
        try {
            const storageFolderFiles = await fs.readdir(this.StorageDict);
            let Blogs = {};
            
            for (const fileName of storageFolderFiles) {
                const filePath = path.join(this.StorageDict, fileName);
                const stats = await fs.stat(filePath);
                const content = await fs.readFile(filePath, 'utf-8');
                const fileExten =  path.extname(fileName).slice(1);

                Blogs[fileName] = {
                    BlogObject: BlogModel.FromDict(JSON.parse(content)),
                    size: stats.size,
                    type:fileExten,
                    lastModified: stats.mtime
                };
            }
            console.log(`blogs uploaded.`)
            return Blogs;
        } catch (err) {
            console.error("Error reading directory:", err);
            return {};
        }
    }

    static async Save(Blog) {
        if(Blog){
            const filePath = BlogModel.createBlogFilePath(Blog.id);
            await fs.writeFile(filePath, JSON.stringify(Blog.toDict(), null, 2));
            console.log(`new blog saved to storage.`)
        } else
            console.log(`blog couldn't be saved to storage.`)
    }

    static async Delete(BlogId) {
        console.log(`deleting blog with id ${BlogId} ..`);
        const filePath = BlogModel.createBlogFilePath(BlogId);
        try {
            const DeletedBlog = BlogModel.getBlogById(BlogId);
            await fs.access(filePath);
            await fs.unlink(filePath);
            console.log(`blog with id ${BlogId} deleted.`);
            return DeletedBlog;
        } catch (err) {
            console.log(`blog with id ${BlogId} couldn't be deleted.`);
            return null;
        }
    }
    static async update(blogId, title, content){

        console.log(`updating blog with id ${blogId} ...`);

        const blog = await BlogModel.getBlogById(blogId);
        let updated = false;

        if(!blog){
            console.log('blog not exist.')
            return null;
        } else {

            if(title){
                blog.Title = title;
                updated = true
            }                
            if(content){
                blog.Content = content
                updated = true
            }
            if (updated){
                console.log('blog updated.')
                const now = new Date();
                blog.UpdatedAt = now;
                await BlogModel.Save(blog);
                console.log(blog)
                return blog
            }
        }
    }
    toDict() {
        return {
            id:this.id,
            Title: this.Title,
            Content: this.Content,
            CreatedAt: this.CreatedAt.toISOString(),
            UpdatedAt: this.UpdatedAt.toISOString()
        };
    }

    static FromDict(BlogDict) {
        const blog = new BlogModel(
            BlogDict['Title'],
            BlogDict['Content']
        );
        blog.CreatedAt = new Date(BlogDict['CreatedAt']);
        blog.UpdatedAt = new Date(BlogDict['UpdatedAt']);
        blog.setId(BlogDict['id']);
        return blog;
    }
}

// Test
// (async () => {
//     const blog = await BlogModel.Create("first blog", "its a very inspiring");
//     await BlogModel.Save(blog);
//     const data = await BlogModel.readStorageDirectoryFiles();
//     console.log(data);
// })();

module.exports = BlogModel;