export async function getPost(id) {
  try {
    const response = await fetch(`http://localhost:3005/posts/${id}`);
    if (!response.ok) throw new Error('Failed to fetch post');
    return await response.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}