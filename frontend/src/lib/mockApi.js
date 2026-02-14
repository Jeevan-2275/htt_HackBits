// Mock API using localStorage for frontend demo

// Dummy AI Questions
const DUMMY_QUESTIONS = [
  "What problem were you facing before using this product?",
  "How did this product improve your workflow?",
  "What measurable results did you achieve?",
  "How easy was it to integrate this product into your business?",
  "Would you recommend this product to others? Why?"
];

// Dummy Transcripts
const DUMMY_TRANSCRIPTS = [
  "We were struggling with managing customer feedback across multiple channels. This product consolidated everything into one dashboard, saving us hours of work every week. The integration was seamless and our team was productive within minutes. I'd definitely recommend it to any business looking to streamline their customer communications.",
  "The workflow improvement has been remarkable. What used to take us an entire day now takes just a few hours. The automated reporting features have given us better insights into customer sentiment. It's become an essential tool for our whole team.",
  "We've seen a 40% increase in team efficiency since implementing this solution. The real-time collaboration features mean we're no longer working in silos. Customer response times have improved significantly, leading to better satisfaction scores.",
  "Integration was incredibly smooth. Our technical team had it up and running in less than an hour. The documentation is clear, and the support team is responsive. It's exactly what we were looking for.",
  "We've recommended this product to three other companies in our industry. It's proven ROI within the first month through time savings alone. The features keep getting better with each update.",
];

// Dummy Highlights
const DUMMY_HIGHLIGHTS = [
  {
    quote: "This product consolidated everything into one dashboard, saving us hours of work every week.",
    timestamp: "0:05"
  },
  {
    quote: "We've seen a 40% increase in team efficiency since implementing this solution.",
    timestamp: "1:20"
  },
  {
    quote: "It's proven ROI within the first month through time savings alone.",
    timestamp: "2:45"
  },
];

// Dummy Clips
const generateDummyClips = () => [
  {
    id: generateId(),
    title: "Problem & Solution",
    duration: "0:45",
    thumbnail: "🎬",
    timestamp: "0:00-0:45"
  },
  {
    id: generateId(),
    title: "Key Results",
    duration: "1:20",
    thumbnail: "📈",
    timestamp: "1:00-2:20"
  },
  {
    id: generateId(),
    title: "Recommendation",
    duration: "0:35",
    thumbnail: "👍",
    timestamp: "2:25-3:00"
  },
];

// Generate random ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// ============ PROCESSING PIPELINE ============

export const processTestimonial = async (testimonialId, onProgress) => {
  return new Promise((resolve) => {
    const steps = [
      { step: "Uploading video...", duration: 800 },
      { step: "Transcribing audio...", duration: 1000 },
      { step: "Extracting highlights...", duration: 1200 },
      { step: "Generating clips...", duration: 1000 },
      { step: "Completed", duration: 200 },
    ];

    let currentStep = 0;
    let currentTime = 0;

    const processStep = () => {
      if (currentStep < steps.length) {
        const step = steps[currentStep];
        onProgress?.(step.step, currentStep + 1);

        setTimeout(() => {
          currentStep++;
          processStep();
        }, step.duration);
      } else {
        const testimonials = JSON.parse(localStorage.getItem("testimonials") || "[]");
        const updatedTestimonials = testimonials.map((t) => {
          if (t.id === testimonialId) {
            return {
              ...t,
              status: "Completed",
              processedAt: new Date().toISOString(),
              transcript: DUMMY_TRANSCRIPTS[Math.floor(Math.random() * DUMMY_TRANSCRIPTS.length)],
              highlights: DUMMY_HIGHLIGHTS,
              clips: generateDummyClips(),
            };
          }
          return t;
        });
        localStorage.setItem("testimonials", JSON.stringify(updatedTestimonials));
        resolve(true);
      }
    };

    processStep();
  });
};

export const updateTestimonialStatus = async (testimonialId, status) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const testimonials = JSON.parse(localStorage.getItem("testimonials") || "[]");
      const updatedTestimonials = testimonials.map((t) =>
        t.id === testimonialId
          ? { ...t, status, processedAt: new Date().toISOString() }
          : t
      );
      localStorage.setItem("testimonials", JSON.stringify(updatedTestimonials));
      resolve(true);
    }, 100);
  });
};

export const getTestimonialById = async (testimonialId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const testimonials = JSON.parse(localStorage.getItem("testimonials") || "[]");
      const campaigns = JSON.parse(localStorage.getItem("campaigns") || "[]");
      
      const testimonial = testimonials.find((t) => t.id === testimonialId);
      if (testimonial) {
        const campaign = campaigns.find((c) => c.id === testimonial.campaignId);
        resolve({
          ...testimonial,
          campaignName: campaign?.name || "Unknown Campaign",
        });
      } else {
        resolve(null);
      }
    }, 200);
  });
};

// ============ CAMPAIGNS ============

export const createCampaign = async (campaignName, productDescription, questions) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const campaignId = generateId();
      const newCampaign = {
        id: campaignId,
        name: campaignName,
        description: productDescription,
        questions: questions || DUMMY_QUESTIONS,
        createdAt: new Date().toISOString(),
        testimonialCount: 0,
      };

      const existingCampaigns = JSON.parse(localStorage.getItem("campaigns") || "[]");
      const updatedCampaigns = [...existingCampaigns, newCampaign];
      localStorage.setItem("campaigns", JSON.stringify(updatedCampaigns));

      resolve(newCampaign);
    }, 500);
  });
};

export const getCampaigns = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const campaigns = JSON.parse(localStorage.getItem("campaigns") || "[]");
      resolve(campaigns);
    }, 300);
  });
};

export const getCampaignById = async (campaignId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const campaigns = JSON.parse(localStorage.getItem("campaigns") || "[]");
      const campaign = campaigns.find((c) => c.id === campaignId);
      resolve(campaign || null);
    }, 200);
  });
};

// ============ TESTIMONIALS ============

export const createTestimonial = async (campaignId, customerName, videoBlob = null) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const testimonialId = generateId();
      const newTestimonial = {
        id: testimonialId,
        campaignId,
        customerName,
        status: "Processing",
        createdAt: new Date().toISOString(),
        processedAt: null,
        transcript: null,
        highlights: [],
        clips: [],
      };

      const existingTestimonials = JSON.parse(localStorage.getItem("testimonials") || "[]");
      const updatedTestimonials = [...existingTestimonials, newTestimonial];
      localStorage.setItem("testimonials", JSON.stringify(updatedTestimonials));

      // Update campaign testimonial count
      const campaigns = JSON.parse(localStorage.getItem("campaigns") || "[]");
      const updatedCampaigns = campaigns.map((c) =>
        c.id === campaignId ? { ...c, testimonialCount: c.testimonialCount + 1 } : c
      );
      localStorage.setItem("campaigns", JSON.stringify(updatedCampaigns));

      resolve(newTestimonial);
    }, 500);
  });
};

export const getTestimonials = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const testimonials = JSON.parse(localStorage.getItem("testimonials") || "[]");
      const campaigns = JSON.parse(localStorage.getItem("campaigns") || "[]");

      // Enrich testimonials with campaign names
      const enrichedTestimonials = testimonials.map((t) => {
        const campaign = campaigns.find((c) => c.id === t.campaignId);
        return {
          ...t,
          campaignName: campaign?.name || "Unknown Campaign",
        };
      });

      resolve(enrichedTestimonials.reverse());
    }, 300);
  });
};

export const getTestimonialsByCampaign = async (campaignId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const testimonials = JSON.parse(localStorage.getItem("testimonials") || "[]");
      const filtered = testimonials.filter((t) => t.campaignId === campaignId);
      resolve(filtered);
    }, 200);
  });
};

// ============ DUMMY QUESTIONS ============

export const generateAIQuestions = async (productDescription) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real scenario, this would call an AI API
      // For now, we return dummy questions
      resolve(DUMMY_QUESTIONS);
    }, 800);
  });
};
