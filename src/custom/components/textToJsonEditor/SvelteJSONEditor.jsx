import {JSONEditor} from "vanilla-jsoneditor";
import {useEffect, useRef} from "react";


const SvelteJSONEditor=(props) => {
    const refContainer = useRef(null);
    const refEditor = useRef(null);

    useEffect(() => {
        // create editor
        refEditor.current = new JSONEditor({
            target: refContainer.current,
            props: {}
        });

        return () => {
            // destroy editor
            if (refEditor.current) {
                console.log("destroy editor");
                refEditor.current.destroy();
                refEditor.current = null;
            }
        };
    }, []);

    // update props
    useEffect(() => {
        if (refEditor.current) {
            refEditor.current.updateProps(props);
        }
    }, [props]);

    return <div className="svelte-jsoneditor-react"
                ref={refContainer}
                style={{
                    display: 'flex',
                    flex: 1,
                    height: 600
                }}/>;
}

export default SvelteJSONEditor;