export async function getPosts() {
  try {
    const response = await fetch('http://localhost:3000/posts');
    if (!response.ok) throw new Error('Failed to fetch posts');
    return await response.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}