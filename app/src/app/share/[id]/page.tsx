import Header from "./Header";
import SharedTask from "./SharedTask";

export default function page({ params }: { params: { id: string } }) {
  return (
    <div>
      <div className="container">
        <Header />
        <SharedTask taskId={params.id} />
      </div>
    </div>
  );
}
