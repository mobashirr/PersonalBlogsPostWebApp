

// get the blog cards list element
let blogsDashboardContainer = document.getElementById('blogs-list-dashboard');


document.addEventListener('DOMContentLoaded', async () => {
    if(blogsDashboardContainer)
        setBlogsListDashboard();

    let submitaddButton = document.getElementById('AddBtn');
    if(submitaddButton)
        submitaddButton.addEventListener('click', addButtonclicked);
});


async function setbuttonsListener() {

    document.querySelector('.add-new-blog-button').addEventListener('click', () =>{
        window.location = '/new'
    });

    document.querySelectorAll('.edit').forEach(el => {
  el.addEventListener('click', () => {
    const id = el.dataset.id;
    // Handle edit, e.g., navigate to edit page
    window.location = `/edit/${id}`;

    });
    });

    document.querySelectorAll('.delete').forEach(el => {
    el.addEventListener('click', async () => {
        const id = el.dataset.id;
        if (confirm('Are you sure you want to delete this?')) {
        await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
        location.reload();
        }
    });

    document.querySelectorAll('.blog-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.tagName === 'H2') {
                const id = e.target.dataset.id;
                if (id) {
                    window.location = `/article/${id}`;

                }
            }
        });
        });
    });


}

async function setBlogsListDashboard(){
    const response = await fetch('api/blogs');
    const blogs = await response.json();
    blogsDashboardContainer.innerHTML =  blogs.map(blog => 
    {
      const dateObj = new Date(blog.CreatedAt);
      const publishDate = dateObj.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      const blogCard = `
    <div class="blog-card">
      <h2 data-id=${blog.id}>
        ${blog.Title} \t \t ${publishDate}
        <button class="edit" data-id="${blog.id}">Edit</button>
        <button class="delete" data-id="${blog.id}">Delete</button>
      </h2>

      <p>${blog.Content}</p>
    </div>
    `
    return blogCard;
    }
    ).join('');

    await setbuttonsListener();
}


async function addButtonclicked() {
  // Prepare the data you want to send
  console.log("add clicked")
  const title = document.getElementById('new-blog-title-input').value;
  const content = document.getElementById('new-blog-content-input').value;
  const data = {
    title: title,
    content: content
  };

  try {
    if(!title || !content)
    window.alert('please complete all fields')
    else {
        const res = await fetch(`/api/blogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        });

        if (res.ok) {
            const blog = await res.json();
        window.alert(`Blog with id ${blog.body.id} Added successfully`);
        window.location.href = '/admin';
        } else {
        window.alert('Failed to Add new blog');
        }
    }

  } catch (err) {
    console.log(err)
    window.alert('Error while adding', err);
  }
  

}