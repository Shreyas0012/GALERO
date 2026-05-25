export const MOCK_DATA = {
  artists: [
    {
      id: "1",
      name: "Elena Rostova",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
      bio: "Contemporary classical painter bridging physical strokes with digital provenance.",
      isVerified: true,
      location: "Paris, France",
      joined: "2022-01-15"
    },
    {
      id: "2",
      name: "Marcus Thorne",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
      bio: "Digital sculptor exploring the intersection of brutalism and organic forms.",
      isVerified: true,
      location: "Berlin, Germany",
      joined: "2023-04-10"
    }
  ],
  artworks: [
    {
      id: "101",
      title: "Ephemeral Silence",
      artistId: "1",
      medium: "Oil on Canvas",
      editionType: "Phygital",
      price: "2.5 ETH",
      status: "active",
      orientation: "portrait",
      images: ["https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800"],
      dimensions: "120x80 cm",
      year: "2023",
      description: "A meditation on the passage of time, capturing a fleeting moment of stillness.",
      provenance: [
        { date: "2023-10-01", event: "Created", details: "Physical painting completed in Paris studio." },
        { date: "2023-10-15", event: "Minted", details: "Digital twin registered as NFT." }
      ]
    },
    {
      id: "102",
      title: "Concrete Reverie",
      artistId: "2",
      medium: "Digital 3D / VR",
      editionType: "Digital 1/1",
      price: "1.2 ETH",
      status: "active",
      orientation: "landscape",
      images: ["https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80&w=1200&h=525"],
      year: "2024",
      description: "Exploring the softness of brutalist architecture through virtual manipulation.",
      provenance: [
        { date: "2024-01-20", event: "Created", details: "Initial render completed." },
        { date: "2024-02-05", event: "Minted", details: "Minted directly to artist vault." }
      ]
    },
    {
      id: "103",
      title: "Golden Hour Study",
      artistId: "1",
      medium: "Watercolor",
      editionType: "Physical",
      price: "0.8 ETH",
      status: "sold",
      orientation: "portrait",
      images: ["https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&q=80&w=600&h=800"],
      year: "2022",
      description: "Early study for the 'Silence' series.",
      provenance: [
        { date: "2022-06-10", event: "Created", details: "Painted in Provence." },
        { date: "2022-08-15", event: "Sold", details: "Acquired by private collector." }
      ]
    }
  ],
  collections: [
    {
      id: "c1",
      name: "The Genesis Drop",
      description: "The very first collection curated for ARTORA featuring foundational digital works from leading visionary artists. A defining moment in digital curation.",
      coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200",
      artworks: ["101", "102"]
    },
    {
      id: "c2",
      name: "Brutalist Dreams",
      description: "An editorial exploration of concrete, monolithic structures, and their intersection with soft organic lighting. Bridging the gap between cold geometry and warm emotion.",
      coverImage: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=1200",
      artworks: ["102"]
    },
    {
      id: "c3",
      name: "Ethereal Landscapes",
      description: "A breathtaking series focusing on the boundary between the physical and the transcendent. Exploring nature through a hyper-real lens.",
      coverImage: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&q=80&w=1200",
      artworks: ["101", "103"]
    }
  ]
};
