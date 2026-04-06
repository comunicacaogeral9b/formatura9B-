/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const JellyfishIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2a8 8 0 0 0-8 8c0 2 1 3.5 3 4.5" />
    <path d="M12 2a8 8 0 0 1 8 8c0 2-1 3.5-3 4.5" />
    <path d="M12 10v12" />
    <path d="M9 14v6" />
    <path d="M15 14v6" />
    <path d="M12 2c-4 0-4 4-4 4s0 4 4 4 4-4 4-4 0-4-4-4z" />
  </svg>
);
