
const BlogModel = require('../models/blogs.js');

class blogsController{

    static async getBlogsController(req,res){
        const Blogs = await BlogModel.getAllBlogs();
        res.status(200).send(Blogs);
    }

    static async getBlogsByIDController(req,res){
        let { id } = req.params
        
        const Blog = await BlogModel.getBlogById(id);

        if(Blog)
            res.status(200).json({
                success:true,
                message: `blog with id ${id} found`,
                body:Blog
            });
        else{
            res.status(400).json({
                success:false,
                message:"blog not found",
                content:[]
            });
        }
            
    }

    static async postBlogController(req, res) {
    try {
        const { title, content } = req.body; // Destructure directly

        if (!title || !content) {
            return res.status(400).json({ error: "Title and content are required" });
        }

        const newBlog = await BlogModel.Create(title, content);
        await BlogModel.Save(newBlog);
        res.status(201).json({
            success:true,
            message:"new blog added",
            body: newBlog.toDict()
        });
    } catch (err) {
        console.error("Error:", err); // Log the actual error
        res.status(500).json({ error: "Failed to create blog" });
    }
}
    static async deleteBlogController(req,res){

        let { id } = req.params;
    
        const DeletedBlog = await BlogModel.Delete(id);
        if(DeletedBlog){
            res.status(300).json({
                message:`blog with id ${DeletedBlog.id} deleted`,
                blog: DeletedBlog
            });
        } else {
            res.status(400).json({
                message:"errror during delete"
            });
        }
    
    }

    static async updateBlogController(req, res) {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        if (!title && !content) {
            return res.status(400).json({ 
                success: false, 
                message: "Missing required fields" 
            });
        }

        const updatedBlog = await BlogModel.update(id, title, content);

        if (updatedBlog) {
            res.status(200).json({ // 200 is more appropriate for a successful update
                success: true,
                message: `Blog with id ${updatedBlog.id} updated successfully`,
                body: [updatedBlog]
            });
        } else {
            res.status(404).json({ 
                success: false, 
                message: "Blog not found" 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Couldn't update the blog", 
            error: error?.message 
        });
    }
}

}

module.exports = blogsController;