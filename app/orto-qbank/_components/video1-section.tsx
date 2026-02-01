export default function Video1Section() {
    return (
        <section className="py-12 md:py-20 px-4">
            <div className="container mx-auto">
                <div className="mx-auto max-w-7xl">
                    <div className="mx-auto mb-8 aspect-video max-w-2xl overflow-hidden rounded-lg shadow-lg">
                        <iframe
                            width="100%"
                            height="100%"
                            src="https://imagekit.io/player/embed/4hmtj9yu8/VID-20251008-WA0049-min.mp4?controls=true&autoplay=false&loop=false&background=%23000000&updatedAt=1759967892697&thumbnail=https%3A%2F%2Fik.imagekit.io%2F4hmtj9yu8%2FVID-20251008-WA0049-min.mp4%2Fik-thumbnail.jpg%3FupdatedAt%3D1759967892697&updatedAt=1759967892697"
                            title="ImageKit video player"
                            sandbox="allow-scripts allow-same-origin"
                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                            loading="lazy"
                            style={{ border: 0 }}
                            className="h-full w-full"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}