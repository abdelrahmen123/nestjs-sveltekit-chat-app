// src/lib/socket.ts
import { io } from 'socket.io-client';
import { url } from './constants/url';

const socket = io(url); // أو عنوان السيرفر

export default socket;
