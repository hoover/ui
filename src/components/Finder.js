import ReactFinder from 'react-finderjs';
import api from '../api';
import url from 'url';

// https://github.com/mynameistechno/finderjs

const treeify = list =>
    list.map(e => ({
        id: e.id,
        label: e.filename,
        children: e.children || [],
    }));

export default class Finder extends React.Component {
    state = {};

    async componentDidMount() {
        const { url: docUrl, data } = this.props;

        if (data.parent_id) {
            const basePath = url.parse(url.resolve(docUrl, './')).pathname;
            const parentUrl = `${basePath}${data.parent_id}`;

            this.setState({
                parent: await api.doc(parentUrl),
            });
            // fetch parent
        }
    }

    render() {
        const { parent } = this.state;
        const { data } = this.props;

        if (!parent) {
            return null;
        }

        const tree = treeify(parent.children);
        let current;

        tree.forEach(node => {
            if (node.id === data.id) {
                current = node;
                node.children = treeify(data.children);
            }
        });

        console.log(tree);

        return (
            <div style={{ margin: '.5rem' }}>
                <ReactFinder data={tree} value={current} />
            </div>
        );
    }
}
