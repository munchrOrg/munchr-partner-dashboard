'use client';

import Link from 'next/link';
import React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type SettingsCard = {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }> | React.ReactElement<SVGSVGElement>;
  iconColor: string;
};

const settingsCards: SettingsCard[] = [
  {
    title: 'Contact Details',
    description: 'Manage your branch and individual contact details',
    href: '/settings/contact-details',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.99993 10.286C10.7751 10.286 12.2142 8.84691 12.2142 7.07171C12.2142 5.29651 10.7751 3.85742 8.99993 3.85742C7.22473 3.85742 5.78564 5.29651 5.78564 7.07171C5.78564 8.84691 7.22473 10.286 8.99993 10.286Z"
          stroke="url(#paint0_linear_3343_19326)"
          stroke-width="1.28571"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M3.51001 15.2998C4.08375 14.358 4.89011 13.5797 5.85156 13.0396C6.81302 12.4995 7.89724 12.2158 9.00001 12.2158C10.1028 12.2158 11.187 12.4995 12.1485 13.0396C13.1099 13.5797 13.9163 14.358 14.49 15.2998"
          stroke="url(#paint1_linear_3343_19326)"
          stroke-width="1.28571"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M8.99996 17.3569C13.6155 17.3569 17.3571 13.6152 17.3571 8.99972C17.3571 4.3842 13.6155 0.642578 8.99996 0.642578C4.38444 0.642578 0.642822 4.3842 0.642822 8.99972C0.642822 13.6152 4.38444 17.3569 8.99996 17.3569Z"
          stroke="url(#paint2_linear_3343_19326)"
          stroke-width="1.28571"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <defs>
          <linearGradient
            id="paint0_linear_3343_19326"
            x1="8.99993"
            y1="3.85742"
            x2="8.99993"
            y2="10.286"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#310260" />
            <stop offset="1" stop-color="#FEBD10" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_3343_19326"
            x1="9.00001"
            y1="12.2158"
            x2="9.00001"
            y2="15.2998"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#310260" />
            <stop offset="1" stop-color="#FEBD10" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_3343_19326"
            x1="8.99996"
            y1="0.642578"
            x2="8.99996"
            y2="17.3569"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#310260" />
            <stop offset="1" stop-color="#FEBD10" />
          </linearGradient>
        </defs>
      </svg>
    ),
    iconColor: 'text-purple-dark',
  },
  {
    title: 'Business management',
    description: "Edit your business' legal information and branch details",
    href: '/settings/business-management',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_3343_19374)">
          <path
            d="M1.92847 10.9287V16.7144C1.92847 16.8849 1.9962 17.0484 2.11676 17.169C2.23731 17.2896 2.40083 17.3573 2.57132 17.3573H15.4285C15.599 17.3573 15.7625 17.2896 15.883 17.169C16.0036 17.0484 16.0713 16.8849 16.0713 16.7144V10.9287"
            stroke="url(#paint0_linear_3343_19374)"
            stroke-width="1.28571"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M10.2856 10.9287V17.3573"
            stroke="url(#paint1_linear_3343_19374)"
            stroke-width="1.28571"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M1.92847 12.8574H10.2856"
            stroke="url(#paint2_linear_3343_19374)"
            stroke-width="1.28571"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M0.642822 5.14258L2.57139 0.642578H15.4285L17.3571 5.14258H0.642822Z"
            stroke="url(#paint3_linear_3343_19374)"
            stroke-width="1.28571"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M6.10711 5.14258V6.42829C6.10711 7.11028 5.83619 7.76433 5.35395 8.24657C4.87171 8.7288 4.21766 8.99972 3.53568 8.99972H3.17568C2.49369 8.99972 1.83964 8.7288 1.3574 8.24657C0.875166 7.76433 0.604248 7.11028 0.604248 6.42829V5.14258"
            stroke="url(#paint4_linear_3343_19374)"
            stroke-width="1.28571"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M11.8929 5.14258V6.42829C11.8929 7.11028 11.622 7.76433 11.1397 8.24657C10.6575 8.7288 10.0034 8.99972 9.32146 8.99972H8.67861C7.99662 8.99972 7.34257 8.7288 6.86033 8.24657C6.3781 7.76433 6.10718 7.11028 6.10718 6.42829V5.14258"
            stroke="url(#paint5_linear_3343_19374)"
            stroke-width="1.28571"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M17.3571 5.14258V6.42829C17.3571 7.11028 17.0862 7.76433 16.604 8.24657C16.1217 8.7288 15.4677 8.99972 14.7857 8.99972H14.4643C13.7823 8.99972 13.1282 8.7288 12.646 8.24657C12.1637 7.76433 11.8928 7.11028 11.8928 6.42829V5.14258"
            stroke="url(#paint6_linear_3343_19374)"
            stroke-width="1.28571"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <linearGradient
            id="paint0_linear_3343_19374"
            x1="8.9999"
            y1="10.9287"
            x2="8.9999"
            y2="17.3573"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#310260" />
            <stop offset="1" stop-color="#FEBD10" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_3343_19374"
            x1="10.7856"
            y1="10.9287"
            x2="10.7856"
            y2="17.3573"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#310260" />
            <stop offset="1" stop-color="#FEBD10" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_3343_19374"
            x1="6.10704"
            y1="12.8574"
            x2="6.10704"
            y2="13.8574"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#310260" />
            <stop offset="1" stop-color="#FEBD10" />
          </linearGradient>
          <linearGradient
            id="paint3_linear_3343_19374"
            x1="8.99996"
            y1="0.642578"
            x2="8.99996"
            y2="5.14258"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#310260" />
            <stop offset="1" stop-color="#FEBD10" />
          </linearGradient>
          <linearGradient
            id="paint4_linear_3343_19374"
            x1="3.35568"
            y1="5.14258"
            x2="3.35568"
            y2="8.99972"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#310260" />
            <stop offset="1" stop-color="#FEBD10" />
          </linearGradient>
          <linearGradient
            id="paint5_linear_3343_19374"
            x1="9.00003"
            y1="5.14258"
            x2="9.00003"
            y2="8.99972"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#310260" />
            <stop offset="1" stop-color="#FEBD10" />
          </linearGradient>
          <linearGradient
            id="paint6_linear_3343_19374"
            x1="14.625"
            y1="5.14258"
            x2="14.625"
            y2="8.99972"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#310260" />
            <stop offset="1" stop-color="#FEBD10" />
          </linearGradient>
          <clipPath id="clip0_3343_19374">
            <rect width="18" height="18" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    iconColor: 'text-[#FEBD10]',
  },
  {
    title: 'Financial details',
    description: 'Manage your bank account details and billing information,',
    href: '/settings/financial-details',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_3343_19340)">
          <path
            d="M16.5984 7.0714H1.40127C0.681268 7.0714 0.372697 6.28712 0.938411 5.91426L8.53698 0.938546C8.67727 0.856018 8.83708 0.8125 8.99984 0.8125C9.1626 0.8125 9.32241 0.856018 9.4627 0.938546L17.0613 5.91426C17.627 6.28712 17.3184 7.0714 16.5984 7.0714Z"
            stroke="url(#paint0_linear_3343_19340)"
            stroke-width="1.28571"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M16.7143 14.1426H1.28568C0.930639 14.1426 0.642822 14.4304 0.642822 14.7854V16.714C0.642822 17.069 0.930639 17.3569 1.28568 17.3569H16.7143C17.0693 17.3569 17.3571 17.069 17.3571 16.714V14.7854C17.3571 14.4304 17.0693 14.1426 16.7143 14.1426Z"
            stroke="url(#paint1_linear_3343_19340)"
            stroke-width="1.28571"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M2.57129 7.07129V14.1427"
            stroke="url(#paint2_linear_3343_19340)"
            stroke-width="1.28571"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M5.78564 7.07129V14.1427"
            stroke="url(#paint3_linear_3343_19340)"
            stroke-width="1.28571"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M9 7.07129V14.1427"
            stroke="url(#paint4_linear_3343_19340)"
            stroke-width="1.28571"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12.2144 7.07129V14.1427"
            stroke="url(#paint5_linear_3343_19340)"
            stroke-width="1.28571"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M15.4285 7.07129V14.1427"
            stroke="url(#paint6_linear_3343_19340)"
            stroke-width="1.28571"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <linearGradient
            id="paint0_linear_3343_19340"
            x1="8.99984"
            y1="0.8125"
            x2="8.99984"
            y2="7.0714"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#310260" />
            <stop offset="1" stop-color="#FEBD10" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_3343_19340"
            x1="8.99996"
            y1="14.1426"
            x2="8.99996"
            y2="17.3569"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#310260" />
            <stop offset="1" stop-color="#FEBD10" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_3343_19340"
            x1="3.07129"
            y1="7.07129"
            x2="3.07129"
            y2="14.1427"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#310260" />
            <stop offset="1" stop-color="#FEBD10" />
          </linearGradient>
          <linearGradient
            id="paint3_linear_3343_19340"
            x1="6.28564"
            y1="7.07129"
            x2="6.28564"
            y2="14.1427"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#310260" />
            <stop offset="1" stop-color="#FEBD10" />
          </linearGradient>
          <linearGradient
            id="paint4_linear_3343_19340"
            x1="9.5"
            y1="7.07129"
            x2="9.5"
            y2="14.1427"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#310260" />
            <stop offset="1" stop-color="#FEBD10" />
          </linearGradient>
          <linearGradient
            id="paint5_linear_3343_19340"
            x1="12.7144"
            y1="7.07129"
            x2="12.7144"
            y2="14.1427"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#310260" />
            <stop offset="1" stop-color="#FEBD10" />
          </linearGradient>
          <linearGradient
            id="paint6_linear_3343_19340"
            x1="15.9285"
            y1="7.07129"
            x2="15.9285"
            y2="14.1427"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#310260" />
            <stop offset="1" stop-color="#FEBD10" />
          </linearGradient>
          <clipPath id="clip0_3343_19340">
            <rect width="18" height="18" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    iconColor: 'text-[#FEBD10]',
  },
  {
    title: 'User Management',
    description: 'Manage your team and what they have access to.',
    href: '/settings/user-management',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.4285 7.71443C8.02618 7.71443 9.32136 6.41925 9.32136 4.82157C9.32136 3.22389 8.02618 1.92871 6.4285 1.92871C4.83082 1.92871 3.53564 3.22389 3.53564 4.82157C3.53564 6.41925 4.83082 7.71443 6.4285 7.71443Z"
          stroke="url(#paint0_linear_3343_19393)"
          stroke-width="1.28571"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M12.2143 17.3576H0.642822V16.0718C0.642822 14.5374 1.25239 13.0658 2.33742 11.9807C3.42245 10.8957 4.89407 10.2861 6.42854 10.2861C7.963 10.2861 9.43462 10.8957 10.5197 11.9807C11.6047 13.0658 12.2143 14.5374 12.2143 16.0718V17.3576Z"
          stroke="url(#paint1_linear_3343_19393)"
          stroke-width="1.28571"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M11.5713 1.92871C12.3385 1.92871 13.0743 2.23349 13.6168 2.77601C14.1594 3.31853 14.4641 4.05433 14.4641 4.82157C14.4641 5.5888 14.1594 6.32461 13.6168 6.86713C13.0743 7.40964 12.3385 7.71443 11.5713 7.71443"
          stroke="url(#paint2_linear_3343_19393)"
          stroke-width="1.28571"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M13.6284 10.5303C14.7236 10.9469 15.6665 11.6863 16.3323 12.6505C16.9981 13.6148 17.3554 14.7585 17.357 15.9303V17.3574H15.4284"
          stroke="url(#paint3_linear_3343_19393)"
          stroke-width="1.28571"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <defs>
          <linearGradient
            id="paint0_linear_3343_19393"
            x1="6.4285"
            y1="1.92871"
            x2="6.4285"
            y2="7.71443"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#310260" />
            <stop offset="1" stop-color="#FEBD10" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_3343_19393"
            x1="6.42854"
            y1="10.2861"
            x2="6.42854"
            y2="17.3576"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#310260" />
            <stop offset="1" stop-color="#FEBD10" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_3343_19393"
            x1="13.0177"
            y1="1.92871"
            x2="13.0177"
            y2="7.71443"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#310260" />
            <stop offset="1" stop-color="#FEBD10" />
          </linearGradient>
          <linearGradient
            id="paint3_linear_3343_19393"
            x1="15.4927"
            y1="10.5303"
            x2="15.4927"
            y2="17.3574"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#310260" />
            <stop offset="1" stop-color="#FEBD10" />
          </linearGradient>
        </defs>
      </svg>
    ),
    iconColor: 'text-purple-dark',
  },
  {
    title: 'Pelican accounts',
    description:
      'Create and manage picker accounts and manage existing master accounts in Pelican app.',
    href: '/settings/pelican-accounts',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_3343_19359)">
          <path
            d="M8.99993 10.286C10.7751 10.286 12.2142 8.84691 12.2142 7.07171C12.2142 5.29651 10.7751 3.85742 8.99993 3.85742C7.22473 3.85742 5.78564 5.29651 5.78564 7.07171C5.78564 8.84691 7.22473 10.286 8.99993 10.286Z"
            stroke="url(#paint0_linear_3343_19359)"
            stroke-width="1.28571"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M3.51001 15.2998C4.08375 14.358 4.89011 13.5797 5.85156 13.0396C6.81302 12.4995 7.89724 12.2158 9.00001 12.2158C10.1028 12.2158 11.187 12.4995 12.1485 13.0396C13.1099 13.5797 13.9163 14.358 14.49 15.2998"
            stroke="url(#paint1_linear_3343_19359)"
            stroke-width="1.28571"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M8.99996 17.3569C13.6155 17.3569 17.3571 13.6152 17.3571 8.99972C17.3571 4.3842 13.6155 0.642578 8.99996 0.642578C4.38444 0.642578 0.642822 4.3842 0.642822 8.99972C0.642822 13.6152 4.38444 17.3569 8.99996 17.3569Z"
            stroke="url(#paint2_linear_3343_19359)"
            stroke-width="1.28571"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <linearGradient
            id="paint0_linear_3343_19359"
            x1="8.99993"
            y1="3.85742"
            x2="8.99993"
            y2="10.286"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#310260" />
            <stop offset="1" stop-color="#FEBD10" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_3343_19359"
            x1="9.00001"
            y1="12.2158"
            x2="9.00001"
            y2="15.2998"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#310260" />
            <stop offset="1" stop-color="#FEBD10" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_3343_19359"
            x1="8.99996"
            y1="0.642578"
            x2="8.99996"
            y2="17.3569"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#310260" />
            <stop offset="1" stop-color="#FEBD10" />
          </linearGradient>
          <clipPath id="clip0_3343_19359">
            <rect width="18" height="18" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    iconColor: 'text-purple-dark',
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {settingsCards.map((card) => {
          const isReactElement = React.isValidElement(card.icon);
          const IconComponent = isReactElement
            ? null
            : (card.icon as React.ComponentType<{ className?: string }>);

          return (
            <Link key={card.href} href={card.href}>
              <Card className="group cursor-pointer rounded-[15px] border border-[#00000026] bg-white shadow-none">
                <CardContent className="">
                  <div className="flex flex-col gap-4.5">
                    <div className="flex items-center justify-between">
                      {isReactElement ? (
                        <div className={cn(card.iconColor)}>
                          {React.cloneElement(card.icon as React.ReactElement<SVGSVGElement>, {
                            className: cn('w-full h-full', card.iconColor),
                          })}
                        </div>
                      ) : (
                        IconComponent && <IconComponent className={cn(card.iconColor)} />
                      )}
                      <div className="flex size-[34px] items-center justify-center rounded-full border border-[#00000026]">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0.5 7H13.5"
                            stroke="#000001"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M10 10.5L13.5 7L10 3.5"
                            stroke="#000001"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">{card.title}</h3>
                      <p className="mt-1 text-sm text-[#918D8C]">{card.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
