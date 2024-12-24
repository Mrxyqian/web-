document.addEventListener('DOMContentLoaded', function () {
  const storedUsername = localStorage.getItem('username');
  if (storedUsername) {
    document.getElementById('username').textContent = storedUsername;
  } else {
    document.getElementById('username').textContent = '访客';
  }

  fetchComments();

  var commentForm = document.getElementById('comment-form');
  if (commentForm) {
    commentForm.onsubmit = function (event) {
      event.preventDefault();
      const username = storedUsername;
      const content = document.getElementById('comment-content').value;
      postComment(username, content);
    };
  } else {
    console.error('The comment form was not found.');
  }

  var searchForm = document.getElementById('search-form');
  if (searchForm) {
    searchForm.onsubmit = function (event) {
      event.preventDefault();
      const username = document.getElementById('search-username').value;
      searchComments(username);
    };
  } else {
    console.error('The search form was not found.');
  }
});

function fetchComments() {
  fetch('http://localhost:5500/get-comments')
    .then(response => response.json())
    .then(comments => {
      const commentsSection = document.getElementById('comments-section');
      commentsSection.innerHTML = '';
      comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';
        commentDiv.dataset.id = comment.id;

        const usernameSpan = document.createElement('span');
        usernameSpan.className = 'comment-username';
        usernameSpan.textContent = comment.user;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'comment-content';
        contentDiv.textContent = comment.content;

        const timeSpan = document.createElement('span');
        timeSpan.className = 'comment-time';
        timeSpan.textContent = new Date(comment.create_time).toLocaleString();

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '删除';
        deleteButton.onclick = function () {
          deleteComment(comment.id);
        };

        const editButton = document.createElement('button');
        editButton.textContent = '编辑';
        editButton.onclick = function () {
          const newContent = prompt('编辑评论内容:', comment.content);
          if (newContent) {
            editComment(comment.id, newContent);
          }
        };

        commentDiv.appendChild(usernameSpan);
        commentDiv.appendChild(contentDiv);
        commentDiv.appendChild(timeSpan);
        commentDiv.appendChild(deleteButton);
        commentDiv.appendChild(editButton);
        commentsSection.appendChild(commentDiv);
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function postComment(username, content) {
  fetch('http://localhost:5500/post-comment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: username, content: content }),
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then(data => {
      console.log('Success:', data);
      fetchComments();
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function deleteComment(id) {
  fetch(`http://localhost:5500/delete-comment/${id}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then(data => {
      console.log('Success:', data);
      fetchComments();
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function editComment(id, content) {
  fetch(`http://localhost:5500/edit-comment/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content: content }),
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then(data => {
      console.log('Success:', data);
      fetchComments();
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function searchComments(username) {
  fetch(`http://localhost:5500/search-comments/${username}`)
    .then(response => response.json())
    .then(comments => {
      const commentsSection = document.getElementById('comments-section');
      commentsSection.innerHTML = '';
      comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';

        const usernameSpan = document.createElement('span');
        usernameSpan.className = 'comment-username';
        usernameSpan.textContent = comment.user;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'comment-content';
        contentDiv.textContent = comment.content;

        const timeSpan = document.createElement('span');
        timeSpan.className = 'comment-time';
        timeSpan.textContent = new Date(comment.create_time).toLocaleString();

        commentDiv.appendChild(usernameSpan);
        commentDiv.appendChild(contentDiv);
        commentDiv.appendChild(timeSpan);
        commentsSection.appendChild(commentDiv);
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
