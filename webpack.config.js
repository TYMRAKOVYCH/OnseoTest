import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from "html-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    entry: './build/index.js',
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Port',
        }),
    ],
    output: {
        filename: 'src/main.js',
        path: path.resolve(__dirname, 'bundle'),
    },
};