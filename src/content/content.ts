import { BsQuestion } from "react-icons/bs";
import { FaMailBulk, FaPhone, FaSchool, FaUser } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { RiBuilding2Fill } from "react-icons/ri";
import { WebsiteContent } from "./types";

export const content: WebsiteContent = {
  header: {
    logo: "FSWS",
    navigation: [
      { name: "About Us", href: "about", icon: RiBuilding2Fill },
      { name: "Products", href: "products", icon: FaUser },
      { name: "Services", href: "services", icon: FaUser },
      { name: "Why Us?", href: "why-us", icon: FaSchool },
      { name: "FAQs", href: "faq", icon: BsQuestion },
      { name: "Contact", href: "contact", icon: FaMailBulk },
    ],
    contactButton: "Contact Us",
  },
  heroSection: {
    id: "home",
    headline: "Zero Waste. Maximum Impact.",
    subheading: "Innovative waste solutions for a cleaner tomorrow.",
    ctaButton: {
      label: "Get in touch",
      href: "contact",
    },
  },
  clientsSection: {
    id: "clients",
    title: "Our Clients",
    clients: [
      {
        name: "Bharat Heavy Electricals Limited",
        image:"/assets/clients/BHEL-light.png",
        darkImage: "/assets/clients/BHEL-dark.png",
      },
      {
        name: "ITC Limited",
        image: "/assets/clients/ITC-light.png",
        darkImage: "/assets/clients/ITC-dark.png",
      },
      {
        name: "Wipro",
        image: "/assets/clients/Wipro-light.png",
        darkImage: "/assets/clients/Wipro-dark.png",
      },
      {
        name: "Unilever",
        image: "/assets/clients/Unilever-light.png",
        darkImage: "/assets/clients/Unilever-dark.png",
      },
      {
        name: "EFS",
        image: "/assets/clients/EFS-light.png",
        darkImage: "/assets/clients/EFS-dark.png",
      },
    ],
  },
  aboutSection: {
    id: "about",
    title: "Who We Are",
    description:
      "First Source Waste Solutions is a leading provider of waste management services. We help businesses reduce waste, recycle efficiently, and achieve their sustainability goals. Our team of experts works closely with clients to develop customized waste management solutions that are cost-effective and environmentally friendly.",
  },
  fertilizerSection: {
    id: "green-products",
    title: "Our Green Products",
    description:
      "Our range of eco-conscious products is crafted from responsibly processed organic waste, transforming everyday horticultural and agricultural by-products into high-value resources. From TerraVita — a nutrient-rich compost that revitalizes soil and supports robust plant growth — to our fortified cattle feed that promotes livestock health and productivity, each solution reflects our commitment to circular economy practices.",
    cards: [
      {
        title: "TerraVita",
        description:
          "A premium organic compost made from horticulture waste, green waste, dry leaves, cow dung and canteen waste. Made from a proprietary bacterial culture, it is rich in nutrients and beneficial microorganisms, promoting healthy plant growth and soil health.",
        images: [
          "/assets/compost/terravita-1.jpg",
          "/assets/compost/compost-site.jpg",
        ],
      },
      {
        title: "Cattle Feed",
        description:
          "A nutritious cattle feed made from a blend of organic materials. It is designed to provide essential nutrients for livestock, promoting health and productivity.",
        images: [
          "/assets/compost/cattle-feed-pellet.jpeg",
          "/assets/compost/pellet-machine.jpg",
        ],
      },
    ],
  },
  productSection: {
    id: "ash-products",
    title: "Our Ash Products",
    description:
      "Innovative, eco-friendly products that transform waste into valuable resources.",

    cards: [
      {
        title: "EcoBricks",
        description:
          "Durable, sustainable building materials made from boiler ash. Made to last and perfect for construction projects.",
        images: [
          // "/assets/products/ecobricks-1.png",
          "/assets/products/ecobricks-2.png",
          "/assets/products/ecobricks-3.png",
        ],
      },
      {
        title: "TerraPots",
        description:
          "Ash-based flowerpots designed for durability and sustainability. Available in multiple shapes and sizes for gardens and landscaping.",
        images: [
          "/assets/products/terrapot-1.png",
          // "/assets/products/terrapot-2.png",
          "/assets/products/terrapot-3.png",
        ],
      },
      {
        title: "SolidBench",
        description:
          "Durable benches made from ash. Built to last and perfect for outdoor and public spaces.",
        images: [
          "/assets/products/solidbench-1.png",
          "/assets/products/solidbench-2.png",
        ],
      },
      {
        title: "AshWall",
        description:
          "Custom walls constructed with EcoBricks. Strong, reliable, and visually appealing for landscaping and construction needs.",
        images: [
          "/assets/products/ashwall-1.png",
          // "/assets/products/ashwall-2.png",
        ],
        pills: ["Custom Order"],
      },
    ],
  },
  servicesSection: {
    id: "services",
    title: "Our Solutions",
    cards: [
      {
        title: "Industrial Waste Disposal",
        description:
          "Safe, efficient, and compliant disposal services tailored to your business.",
        image: "/assets/services/industrial-waste.webp",
      },
      {
        title: "Recycling & Reuse",
        description:
          "Innovative recycling technologies to reduce landfill usage and save resources.",
        image: "/assets/services/recycling.webp",
      },
      {
        title: "Waste Audits",
        description:
          "Streamline your processes, minimize waste, and save money with our expert audits.",
        image: "/assets/services/waste-audit.webp",
      },
      {
        title: "Consulting Services",
        description:
          "Navigate regulations and find efficient waste management strategies.",
        image: "/assets/services/consulting.webp",
      },
    ],
  },
  impactSection: {
    id: "why-us",
    title: "We make change happen.",
    statistics: [
      {
        stat: "100% Eco-Friendly",
        description: "Products made from recycled or organic materials",
        isRollingNumber: false,
      },
      {
        stat: "4000+ Bricks",
        description: "Production Per Day",
        isRollingNumber: true,
      },
      {
        stat: "5,000+ Tons",
        description: "Waste diverted from landfills",
        isRollingNumber: true,
      },
      {
        stat: "500,000+ kg",
        description: "Industrial ash transformed into products",
        isRollingNumber: true,
      },
    ],
  },
  faqSection: {
    id: "faq",
    title: "Frequently Asked Questions",
    questions: [
      {
        question: "How can I place an order for EcoBricks or other products?",
        answer:
          "To place an order, contact us via email at help@fsws.in or call us at +91 90688 55443. Our team will assist you with pricing, product specifications, and delivery options.",
      },
      {
        question: "How do EcoBricks benefit the environment?",
        answer:
          "EcoBricks utilize industrial byproducts like ash and ETP-sludge, reducing waste and minimizing the use of natural resources.",
      },
      {
        question: "Are EcoBricks compliant with construction standards?",
        answer:
          "Yes, EcoBricks are designed to meet industry standards for strength and reliability, making them suitable for various construction projects.",
      },
      {
        question: "What types of waste do you manage?",
        answer:
          "We manage all types of non-hazardous solid waste including industrial waste, recyclables, and organic waste.",
      },
      {
        question: "How do you help businesses reduce waste?",
        answer:
          "Our waste audits identify inefficiencies and recommend strategies to minimize waste generation and maximize recycling.",
      },
      {
        question: "Do you offer custom waste management plans?",
        answer:
          "Yes, we provide tailored waste management solutions to meet the specific needs of your business or industry. We assess your requirements and design a plan that maximizes efficiency and sustainability.",
      },
      {
        question: "How do your waste audits work?",
        answer:
          "Our waste audits analyze your current waste disposal practices to identify areas for improvement. We provide actionable recommendations to reduce waste, enhance recycling, and lower overall costs.",
      },
      {
        question:
          "Are your services compliant with local and national regulations?",
        answer:
          "Yes, we ensure that all our waste management practices comply with local, state, and federal regulations, so you can be confident in staying fully compliant while reducing environmental impact.",
      },
      {
        question: "What are TerraVita and your cattle feed made from?",
        answer:
          "TerraVita compost is made from horticulture waste, dry leaves, cow dung, and canteen waste using a proprietary bacterial culture. Our cattle feed is formulated from organic byproducts to provide balanced nutrition for livestock.",
      },
      {
        question: "Are your green products certified or tested?",
        answer:
          "Yes, our green products undergo quality checks for safety, efficacy, and environmental compliance. TerraVita meets compost quality benchmarks, and our cattle feed is lab-tested for nutritional value.",
      },
      {
        question: "How do your products support sustainable agriculture?",
        answer:
          "Our compost enriches soil health naturally without chemical inputs, while the cattle feed supports livestock productivity using upcycled organic ingredients — reducing dependence on conventional farming inputs.",
      },
      {
        question: "Can I request bulk quantities of compost or feed?",
        answer:
          "Absolutely. We cater to both retail and bulk orders. Contact us for customized packaging, recurring delivery options, and bulk pricing.",
      },
    ],
  },
  contactSection: {
    id: "contact",
    contactMethodsTitle: "Contact Us Directly",
    enableForm: false,

    title: "Or send us a message",
    fields: [
      {
        id: "email",
        label: "Email",
        type: "email",
        placeholder: "Enter your email",
      },
      {
        id: "message",
        label: "Message",
        type: "textarea",
        placeholder: "Enter your message",
      },
    ],
    contactMethods: [
      {
        name: "Email",
        value: "help@fsws.in",
        icon: IoMail,
        href: "mailto:help@fsws.in",
      },
      {
        name: "Phone",
        value: "+91 90688 55443",
        icon: FaPhone,
        href: "tel:+919068855443",
      },
      {
        name: "Alternate Phone",
        value: "+91 74095 16090",
        href: "tel:+917409516090",
        icon: FaPhone,
      },
    ],
  },
  footer: {
    copyright: `© ${new Date().getFullYear()} First Source Waste Solutions. All Rights Reserved.`,
    GSTIN: "05AADCF8128L1ZG",
    MSME: "UDYAM-UK-06-0004657",
  },
};
