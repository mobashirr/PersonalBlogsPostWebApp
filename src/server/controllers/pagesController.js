

class pagesController {

    static apiUrl = 'http://localhost:8000';

    static homePageController(req,res){
        res.render('home', {
        title:"Home Page",
        });
    }

    static async articlePageController(req,res){
        const {id} = req.params

        const response = await fetch(`${pagesController.apiUrl}/api/blogs/${id}`);

        if(response.ok){
            const blog = await response.json()
            if(blog){
                const dateObj = new Date(blog.body.UpdatedAt);
                const publishDate = dateObj.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });

                res.render('article', {
                title:blog.body.title,
                blog:blog.body,
                publishDate: publishDate
                });
            } 
        }else {
            res.redirect('/home');
        }
    }

    static adminPageController(req, res){
        res.render('admin', {
            title:"Admin",
            content: "Restricted area"
        });
    }

    static async editPageController(req,res){

        const id = req.params.id;

        const response = await fetch(`${pagesController.apiUrl}/api/blogs/${id}`);

        if(response.ok){
            const blog = await response.json();

            res.render('edit', {
                title:blog.body.Title,
                blog:blog.body
            });
        }
    }

    static async addPageController(req,res){
        res.render('new', {
                title:"New Blog"
        });
    }
}

module.exports = pagesController;