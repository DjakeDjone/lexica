export const convertMdToLatex = (mdContent: string): {
    page: string;
    citations: string[];
} => {
    let latex = "";
    const lines = mdContent.split('\n');
    const citations = new Set<string>();

    const replacements: [RegExp, string | ((match: string, ...args: any[]) => string)][] = [
        [/^# (.*)/, '\\section{$1}'],
        [/^## (.*)/, '\\subsection{$1}'],
        [/^### (.*)/, '\\subsubsection{$1}'],
        [/^#### (.*)/, '\\paragraph{$1}'],
        [/^##### (.*)/, '\\subparagraph{$1}'],
        [/\*\*(.*?)\*\*/g, '\\textbf{$1}'],
        [/\*(.*?)\*/g, '\\textit{$1}'],
        [/`(.*?)`/g, '\\texttt{$1}'],
        [/\!\[(.*?)\]\((.*?)\)/g, '\\begin{figure}[h]\\centering\\includegraphics[width=0.8\\textwidth]{$2}\\caption{$1}\\end{figure}'],
        [/\[(.*?)\]\((.*?)\)/g, '\\href{$2}{$1}'],
        [/^---$/, '\\hrulefill'],
        // Support citations: [@source]
        // This will convert [@source] to \cite{source} and collect the source
        [/\[@([^\]\s]+)\]/g, (match, key) => {
            citations.add(key);
            return `\\cite{${key}}`;
        }],
    ];

    let inItemize = false;
    let inEnumerate = false;
    let inVerbatim = false;

    lines.forEach((line, idx) => {
        let processedLine = line;

        // Handle code blocks
        if (/^```/.test(line)) {
            if (!inVerbatim) {
                latex += '\\begin{verbatim}\n';
                inVerbatim = true;
            } else {
                latex += '\\end{verbatim}\n';
                inVerbatim = false;
            }
            return;
        }

        if (inVerbatim) {
            latex += line + '\n';
            return;
        }

        // Handle blockquotes
        if (/^> (.*)/.test(line)) {
            latex += '\\begin{quote}' + line.replace(/^> (.*)/, '$1') + '\\end{quote}\n';
            return;
        }

        // Handle lists
        if (/^- (.*)/.test(line)) {
            if (!inItemize) {
                latex += '\\begin{itemize}\n';
                inItemize = true;
            }
            processedLine = line.replace(/^- (.*)/, '\\item $1');
        } else if (/^\d+\. (.*)/.test(line)) {
            if (!inEnumerate) {
                latex += '\\begin{enumerate}\n';
                inEnumerate = true;
            }
            processedLine = line.replace(/^\d+\. (.*)/, '\\item $1');
        } else {
            // If previous line was a list and current line is not, close the environment
            if (inItemize && !/^- (.*)/.test(line)) {
                latex += '\\end{itemize}\n';
                inItemize = false;
            }
            if (inEnumerate && !/^\d+\. (.*)/.test(line)) {
                latex += '\\end{enumerate}\n';
                inEnumerate = false;
            }
        }

        // Apply replacements
        for (const [regex, replacement] of replacements) {
            processedLine = processedLine.replace(regex, replacement as any); // Type assertion for simplicity
        }

        latex += processedLine + '\n';
    });

    // Close any open environments at the end
    if (inItemize) {
        latex += '\\end{itemize}\n';
    }
    if (inEnumerate) {
        latex += '\\end{enumerate}\n';
    }
    if (inVerbatim) {
        latex += '\\end{verbatim}\n';
    }

    return { page: latex, citations: Array.from(citations) };
};
