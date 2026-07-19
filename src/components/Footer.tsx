export default function Footer() {
  return (
    <footer className="px-10 py-16 bg-white border-t">
      <div className="grid md:grid-cols-4 gap-10 text-sm text-gray-600">
        <div>
          <h3 className="font-bold mb-3">Popular Courses</h3>
          <p>Web Development</p>
          <p>Data Science</p>
        </div>

        <div>
          <h3 className="font-bold mb-3">Categories</h3>
          <p>Technology</p>
          <p>Business</p>
        </div>

        <div>
          <h3 className="font-bold mb-3">About</h3>
          <p>About us</p>
          <p>Careers</p>
        </div>

        <div>
          <h3 className="font-bold mb-3">Community</h3>
          <p>Forums</p>
          <p>Events</p>
        </div>
      </div>
    </footer>
  );
}
