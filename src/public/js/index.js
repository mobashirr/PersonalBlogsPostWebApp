

let blogsContainer = document.getElementById('blogs-list');
let submitEditButton = document.getElementById('updateBtn');

document.addEventListener('DOMContentLoaded', async () => {

    if(blogsContainer)
        setBlogsList();

    if(submitEditButton)
      submitEditButton.addEventListener('click', updateButtonclicked);

    document.querySelector('.Admin-Page-btn').addEventListener('click', () =>{
        window.location = '/admin'
    });
});


async function  setBlogsList() {
    const response = await fetch('api/blogs');
    const blogs = await response.json();
    let blogs_card = blogs.map(blog => 
    {
      const dateObj = new Date(blog.UpdatedAt);
      const publishDate = dateObj.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      const blogCard = `
    <div class="blog-card">
      <h2 data-id=${blog.id}>${blog.Title} \t \t (${publishDate})</h2>
      <p>${blog.Content}</p>
    </div>
    `
    return blogCard;
    }
    ).join('');
    blogsContainer.innerHTML = blogs_card? blogs_card:"<br> <p style='text-align: center;'> You havn't post Yet </p>";

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
}


async function updateButtonclicked() {
  // Prepare the data you want to send
  const title = document.getElementById('new-title-input');
  const content = document.getElementById('new-content-input');
  const id = document.getElementById('blog-id').value;
  const data = {
    title: title.value,
    content: content.value,
  };
  
  try {
    const res = await fetch(`/api/blogs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      window.alert('Blog updated successfully');
    } else {
      window.alert('Failed to update');
    }
  } catch (err) {
    window.alert('Error while updating', err);
  }
  window.location.href = '/admin';

}