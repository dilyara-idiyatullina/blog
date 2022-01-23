function createAppTitle(title) {
  const appTitle = document.createElement('h1');
  appTitle.style.textAlign = 'center';
  appTitle.style.marginBottom = '50px';
  appTitle.innerHTML = title;
  return appTitle;
}

function createPostBody(body) {
  const postBody = document.createElement('p');
  postBody.style.marginBottom = '50px';
  postBody.innerText = body;
  return postBody;
}

function createAppTitleH3(title) {
  const appTitle = document.createElement('h3');
  appTitle.style.marginBottom = '50px';
  appTitle.innerHTML = title;
  return appTitle;
}

function createSpinner() {
  const spinner = document.createElement('div');
  spinner.classList.add('spinner', 'visually-hidden');
  const spinnerBorder = document.createElement('div');
  spinnerBorder.classList.add('spinner-border');
  spinnerBorder.role = 'status';
  const span = document.createElement('span');
  span.classList.add('visually-hidden');
  span.innerText = 'Загрузка комментариев...';
  spinnerBorder.append(span);
  spinner.append(spinnerBorder);
  return spinner;
}

function doUnvisiblePages(currentPage, pagesShowNumber, pagesTotalNumber, where) {
  let cp = currentPage;
  let psn = pagesShowNumber;
  if (where === 'next') {
    for (let i = 1; i <= psn; i++) {
      cp.style.display = 'none';
      cp = cp.previousSibling;
    }
  } else {
    if (pagesTotalNumber - parseInt(cp.innerText, 10) < psn) {
      psn = pagesTotalNumber - parseInt(cp.innerText, 10) + 1;
    }
    for (let i = 1; i <= psn; i++) {
      cp.style.display = 'none';
      cp = cp.nextSibling;
    }
  }
}

function doVisiblePages(currentPage, pagesShowNumber, pagesTotalNumber, where) {
  let cp = currentPage;
  let psn = pagesShowNumber;
  if (where === 'next') {
    if (pagesTotalNumber - parseInt(cp.innerText, 10) < psn) {
      psn = pagesTotalNumber - parseInt(cp.innerText, 10);
    }
    for (let i = 1; i <= psn; i++) {
      cp = cp.nextSibling;
      cp.style.display = '';
    }
  } else {
    for (let i = 1; i <= psn; i++) {
      cp = cp.previousSibling;
      cp.style.display = '';
    }
  }
}

function createPageNavigation(pagesTotalNumber, pagesShowNumber, openPageNumber) {
  const pageNavigationHandlers = {
    onPage(liPrev, liNext, liCurr) {
      if (liCurr.innerText === '1') {
        liPrev.classList.toggle('disabled', true);
      } else {
        liPrev.classList.toggle('disabled', false);
      }
      if (liCurr.innerText === pagesTotalNumber.toString()) {
        liNext.classList.toggle('disabled', true);
      } else {
        liNext.classList.toggle('disabled', false);
      }

      document.querySelector('.active').classList.remove('active');
      liCurr.classList.add('active');
    },
    onPrev(liPrev, liNext) {
      if (liPrev.classList.contains('disabled')) {
        return;
      }

      const currentPage = document.querySelector('.active');

      if (parseInt(currentPage.innerText, 10) % pagesShowNumber === 1) {
        // проматываем назад видимые страницы
        doUnvisiblePages(currentPage, pagesShowNumber, pagesTotalNumber, 'prev');
        doVisiblePages(currentPage, pagesShowNumber, pagesTotalNumber, 'prev');
      }
      currentPage.classList.remove('active');
      const prevPage = currentPage.previousSibling;
      prevPage.classList.add('active');

      liPrev.querySelector('a').href = `blog.html?page=${prevPage.innerText}`;
      if (parseInt(prevPage.innerText, 10) === 1) {
        liPrev.classList.toggle('disabled', true);
        liPrev.querySelector('a').href = 'blog.html';
      }
      if (liNext.classList.contains('disabled')) {
        liNext.classList.toggle('disabled', false);
      }
    },
    onNext(liPrev, liNext) {
      if (liNext.classList.contains('disabled')) {
        return;
      }

      const currentPage = document.querySelector('.active');

      if (parseInt(currentPage.innerText, 10) % pagesShowNumber === 0) {
        // проматываем вперед видимые страницы
        doUnvisiblePages(currentPage, pagesShowNumber, pagesTotalNumber, 'next');
        doVisiblePages(currentPage, pagesShowNumber, pagesTotalNumber, 'next');
      }
      currentPage.classList.remove('active');
      const nextPage = currentPage.nextSibling;
      nextPage.classList.add('active');
      liNext.querySelector('a').href = `blog.html?page=${nextPage.innerText}`;
      if (nextPage.innerText === pagesTotalNumber.toString()) {
        liNext.classList.toggle('disabled', true);
      }
      if (liPrev.classList.contains('disabled')) {
        liPrev.classList.toggle('disabled', false);
      }
    },
  };

  let psn = pagesShowNumber;
  if (pagesTotalNumber <= 0) {
    return false;
  }
  if (pagesTotalNumber < psn) {
    psn = pagesTotalNumber;
  }

  const nav = document.createElement('nav');
  const liPrev = document.createElement('li');
  const liNext = document.createElement('li');
  const ul = document.createElement('ul');
  nav.ariaLabel = 'Page navigation';
  nav.classList.add('mb-5');
  ul.classList.add('pagination', 'justify-content-center');
  liPrev.classList.add('page-item');
  if (openPageNumber === 1) {
    liPrev.classList.add('disabled');
  }
  const linkPrev = document.createElement('a');
  linkPrev.classList.add('page-link');
  linkPrev.href = '#';
  linkPrev.tabIndex = -1;
  linkPrev.ariaDisabled = true;
  linkPrev.innerHTML = 'Previous';
  liPrev.append(linkPrev);
  liPrev.addEventListener('click', () => {
    pageNavigationHandlers.onPrev(liPrev, liNext);
  });
  ul.append(liPrev);

  for (let i = 1; i <= pagesTotalNumber; i++) {
    const li = document.createElement('li');
    li.classList.add('page-item');
    if (i === openPageNumber) {
      li.classList.add('active');
    }

    const pagesBlock = Math.ceil(openPageNumber / psn);
    const minVisiblePage = (pagesBlock - 1) * psn + 1;
    const maxVisiblePage = (pagesTotalNumber
      < ((pagesBlock - 1) * psn + psn))
      ? pagesTotalNumber : ((pagesBlock - 1) * psn + psn);

    if (i < minVisiblePage || i > maxVisiblePage) li.style.display = 'none';

    li.addEventListener('click', () => {
      pageNavigationHandlers.onPage(liPrev, liNext, li);
    });

    const link = document.createElement('a');
    link.classList.add('page-link');
    if (i === 1) {
      link.href = 'blog.html';
    } else {
      link.href = `blog.html?page=${i}`;
    }
    link.innerText = i;
    li.append(link);
    ul.append(li);
  }

  liNext.classList.add('page-item');
  if (openPageNumber === pagesTotalNumber) {
    liNext.classList.add('disabled');
  }
  const linkNext = document.createElement('a');
  linkNext.classList.add('page-link');
  linkNext.href = '#';
  linkNext.innerHTML = 'Next';
  liNext.append(linkNext);
  liNext.addEventListener('click', () => {
    pageNavigationHandlers.onNext(liPrev, liNext);
  });
  ul.append(liNext);
  nav.append(ul);
  return nav;
}

function createArticlesList() {
  const list = document.createElement('ul');
  list.classList.add('list-group', 'list-group-flush');
  return list;
}

function createCommentsList(comments) {
  if (comments.length === 0) {
    return 'Комментариев нет';
  }
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'list-group-flush');
  comments.forEach((comment) => {
    const li = document.createElement('li');
    const author = document.createElement('h5');
    author.innerText = comment.name;
    li.classList.add('list-group-item');
    const p = document.createElement('p');
    p.innerText = comment.body;
    li.append(author);
    li.append(p);
    ul.append(li);
  });
  return ul;
}

function createArticleElement(articleItem) {
  const item = document.createElement('li');
  item.classList.add('list-group-item');
  const link = document.createElement('a');
  link.href = `article.html?id=${articleItem.id}`;
  link.target = '_blank';
  link.innerText = articleItem.title;
  item.append(link);
  return item;
}

async function createBlog(container, title, openPageNumber) {
  const spinner = document.querySelector('.spinner');
  spinner.classList.remove('visually-hidden');
  const blogTitle = createAppTitle(title);
  const response = await fetch(`https://gorest.co.in/public-api/posts?page=${openPageNumber}`);

  const blogInfo = await response.json();

  if (openPageNumber > blogInfo.meta.pagination.pages) {
    spinner.classList.add('visually-hidden');
    alert('Заданной страницы не существует! \n Вы перенаправлены на последнюю страницу.');
    createBlog(container, title, blogInfo.meta.pagination.pages);
    return;
  }
  const pageNavigation = createPageNavigation(blogInfo.meta.pagination.pages, 20, openPageNumber);
  const articlesList = createArticlesList();

  container.append(blogTitle);
  container.append(pageNavigation);
  container.append(articlesList);

  spinner.classList.add('visually-hidden');

  blogInfo.data.forEach((articleItem) => {
    const articleItemElement = createArticleElement(articleItem);
    articlesList.append(articleItemElement);
  });
}

async function showArticle(container, openPostId) {
  const spinner = document.getElementById('spinner');
  spinner.classList.remove('visually-hidden');

  const responsePost = await fetch(`https://gorest.co.in/public-api/posts/${openPostId}`);
  const postInfo = await responsePost.json();

  if (openPostId === 0 || postInfo.code === 404) {
    const postTitle = createAppTitle('Статья не найдена!');
    spinner.classList.add('visually-hidden');
    container.append(postTitle);
    return;
  }

  const postTitle = createAppTitle(postInfo.data.title);
  const postBody = createPostBody(postInfo.data.body);

  container.append(postTitle);
  container.append(postBody);
  spinner.classList.add('visually-hidden');

  const commentsTitle = createAppTitleH3('Комментарии:');
  const commentsSpinner = createSpinner();
  commentsSpinner.classList.remove('visually-hidden');
  container.append(commentsTitle);
  container.append(commentsSpinner);

  const responseComments = await fetch(`https://gorest.co.in/public-api/comments?post_id=${postInfo.data.id}`);
  const commentsInfo = await responseComments.json();

  const commentsList = createCommentsList(commentsInfo.data);
  commentsSpinner.classList.add('visually-hidden');
  container.append(commentsList);
}

window.createBlog = createBlog;
window.showArticle = showArticle;
