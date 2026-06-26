import ItemForm from '../components/ItemForm';
import '../styles/Post.css';

export default function Post() {
  return (
    <div className="post-page">
      <div className="post-container">
        <div className="post-header">
          <h1>Post an Item</h1>
          <p>Help others find their lost items or report what you found</p>
        </div>
        <ItemForm />
      </div>
    </div>
  );
}
