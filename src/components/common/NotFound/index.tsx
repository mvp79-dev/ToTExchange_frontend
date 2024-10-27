import UserLayout from "@/components/layouts/UserLayout";

type Props = {
  message?: string;
};

export default function NotFoundPage({
  message = "This page could not be found.",
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
      }}
    >
      <h1 style={{ fontWeight: "400" }}>404 | {message}</h1>
    </div>
  );
}
