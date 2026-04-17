> Meter as Faithfulness
> 
> Abstract: In this paper I propose a theory of meter that treats it as Optimality-Theoretic (OT) faithfulness. At core of the proposal is the notion of meter as similarity between an abstract metrical template consisting of prosodic structure without segmental content, and the prosodic structure of a line of verse. Faithfulness is the measure of similarity in OT. I develop a general theory of faithfulness between prosodic structures using standard OT tools, and apply it to meter. I test the theory by investigating two aspects of English iambic meters, phrasal peaks in weak positions, and stressed syllables in weak positions, as well as the interaction of stress and meter in Latin hexameter endings. Because many analytically interesting aspects of meter involve gradient preference rather than absolute metricality, the theory is embedded in the multiple-grammars theory of variation. The chief advantage of the present approach is its commitment to the grounding hypothesis, viz. the claim that rule-governed aspects of meter can be analyzed using the same tools as ordinary grammar.
> 
> Keywords: metrics; prosody: faithfulness poetics
> 
> 1 Introduction
> 
> 1.1 Background
> 
> It is almost a truism that the material of poetry is language itself, but the apparent triviality of this observation is deceptive. Even in the narrow domain of linguistic metrics, which is concerned with the rule-governed aspects of sound patterning in poetry, the connection between the structure of verse and language is far from obvious. The precise characterization of this connection is one of the tasks of metrical theory.
> 
> Generative metrics, which originated in the works of Halle & Keyser (1966, 1971) and Magnuson & Rider (1970, 1971) and traces its pedigree to Jakobson (1979
> 
> $$1923$$
> 
> , 1960), takes a strong view of the grounding of meter in language. The basic idea, which I will call The Grounding Hypothesis, is that the theory of poetic structure should use the same mechanisms as the theory of language.
> 
> $$^1$$
> 
> The Grounding Hypothesis subsumes several distinct components. The categories that are relevant to verse must be linguistically relevant. This includes the units that are counted by meter (words, stresses, syllables), and the criteria by which those units are treated as identical or similar. Not just the categories, but the grammatical toolbox of rules or constraints that describe meter should not be specific to it, but must come from the general toolbox used by ordinary grammar. These aspects of grounding are universal, in that UG makes available to the poetic system, just as to language, some categories and mechanisms but not others. There is also a language-particular side to grounding; it is a long-standing observation that the phonological system of a language affects the kinds of metrical rules a poetic tradition is likely to employ.
> 
> The Grounding Hypothesis entails that the desiderata of metrical theory are similar to those of any explanatory theory of grammar: it must assign representations to data and delimit the range of grammatical expressions. A stronger desideratum is to classify occurring, potential, and impossible strings into more fine-grained categories according to some measure of complexity or markedness. As I will discuss below, existing theories of meter, especially theories in OT, often leave the grounding aspect implicit. In Optimality-Theoretic terms (OT; Prince & Smolensky 2004
> 
> $$1993$$
> 
> ), lack of attention to grounding often means lack of an explicit theory of constraints. This is a significant gap which I attempt to remedy in this paper.
> 
> In this paper I propose a theory of meter, called Meter As Faithfulness (MAF), which takes the Grounding Hypothesis seriously. Following the common understanding, meter is conceived as a matter of similarity between the prosody of a linguistic representation and an abstract representation of the meter. In OT, similarity is handled by the theory of faithfulness and correspondence. In MAF, metricality is evaluated using ordinary faithfulness constraints such as MAX and DEP, and other mechanisms motivated independently in phonological theory. Unlike previous OT-based theories of meter, MAF uses no meter-specific mechanisms.
> 
> Such a commitment to grounding makes for a more parsimonious theory, both conceptually and empirically. Many properties of meters which previously had to be stipulated become straightforward consequence of the constraint system itself. The theory also provides a cross-linguistic typology of metrical systems, as well as the tools to study variation and complexity within a system. These aspects of MAF will be explored below.
> 
> This paper focuses on the issues of representation and the interface of meter and grammar. Recent work on meter has also been concerned with an equally important, but independent set of questions revolving around the gradient nature of the data, in line with a wider trend in generative linguistics to develop more sophisticated models of variability. The gradient character of meter is especially prominent and unavoidable unless we limit ourselves to the most trivial observations. Cutoffs defining absolute unmetricality are not as analytically interesting as the degree to which a poet avoids or prefers a given metrical configuration.
> 
> Interest in gradience has been at the fore of metrics since the earliest works of Halle and Keyser. There are a number of general models on the market that are capable of handling gradient data, such as Stochastic OT (Boersma & Hayes 2001), Maxent Grammar (Hayes & Wilson 2008), and Multiple Grammars Theory (MGT; Anttila 2006, 2009, in press).
> 
> Of these three models, MGT is the most conservative, because it achieves its results using the least machinery in addition to standard OT. I will suggest below that MGT's power is sufficient to express metrically interesting generalizations. That being said, the broad architecture of MAF is compatible with many approaches to variation. As the main focus is on the nature of constraints, I leave the full argument for the correct theory of variation for another day.
> 
> $$^2$$
> 
> This paper is organized as follows. Before I turn to the specifics of my proposal, in the remainder of this section I will sketch the general theoretical options available to metrical theory, and summarize the global architecture of MAF. The tools of the theory are then developed in Section 2, which introduces the representational system and the theory of prosodic faithfulness. Section 3 is devoted to applications to English and Latin meters.
> 
> 1.2 Theoretical choices
> 
> Theories of meter on the market can be classified along two independent dimensions. The first choice is representational, between approaches that are "serial" and ones that are "rhythmic" (the terms come from Prince 1989). In serial theories, meter is conceived as a sequence of positions without any further organization. Rhythmic theories assume a hierarchical structure that organizes those positions.
> 
> The second distinction has to do with the degree of modularity, or "componentiality" of the theory (Kiparsky 1975, 1977; Hayes 2009). In strongly componential theories, there are three components. The Template Generator (also called the Pattern Generator) produces a set of abstract metrical templates. The Paraphonology outputs linguistic representations that are relevant to meter. It is usually nearly identical to the language's phonological component, but may include some meter-specific rules or constraint rankings. Finally, the two representations—template and text—are matched in Comparator, which I will call the Matcher, to produce either a metrical parse or an indication that the line is unmetrical.
> 
> In strongly componential theories, metrical representations contain the linguistic structure, the abstract metrical pattern, and the linking between the two. Verse is thus categorically distinct from prose, in that it possesses additional structure. Meter and phonology in such theories interact only indirectly.
> 
> (1)
>         [template generator]                [paraphonology]
>                   \                                /
>                    \                              /
>                     v                            v
>                   [           matcher            ]
>                      /                        \
>                     v                          v
>              [metrical parse]            [unmetricality]
> 
> 
> 
> Annotation for Schema (1): This functional diagram illustrates the architecture of a componential metrical theory. Two independent generation engines (one for the abstract metrical template, one for linguistic phonology) feed into a central "Matcher." The Matcher attempts to link the inputs, resulting in either a successful metrical parse or a state of unmetricality (ineffability).
> 
> Theories that are non-componential—call them holistic—lack such separation into modules. Meter is seen not as an abstract pattern or additional structure, but as an aspect of the line's phonology. While a componential theory evaluates a line via its linking to the template, in holistic theories a line is metrical to the extent its phonological representation meets certain surface-form constraints, e.g. constraints on the distribution of stresses, number of syllables, and so forth. Metrical representations are not distinct from linguistic representations in such a theory; there is no sharp boundary between verse and prose. Phonology and meter interact directly.
> 
> An option intermediate between strong componentiality and holism, which I will call weak componentiality, is to keep the Template Generator separate, but to collapse the Matcher and the Paraphonology. Such a theory would still be templatic, but would entail direct interaction of meter and phonology.
> 
> Taking both kinds of componential theories as a single category, the four-way typology of potential theories has been fully represented in the literature.
> 
> |
> 
> |  | Serial | Rhythmic |
> | Holistic | Traditional metrics
> 
> $$^3$$
> 
>  | Golston 1998 et seq. |
> | Templatic | Fabb & Halle 2008 | the rest of the field |
> 
> Table 1: Theoretical options
> 
> Traditional metrics, such as the approach taken in Saintsbury (1914, 1923), can be characterized as holistic and serial. It is holistic because the prosody of the line itself is understood to be the meter, and deviations from ideal are thought as 'metrical substitutions'. No distinction is made between variation in the template and variation in its realization. The units constituting meter are abstract, unorganized sequences of 'long' and 'short' slots, which makes the traditional theories serial.
> 
> Generative metrics has yielded theories that instantiate the remaining three theoretical possibilities. One line of research, starting with Halle & Keyser (1966, 1971) and continuing through the work of Fabb (1997, 2002) and Fabb & Halle (2008), explored a templatic and serial approach. In Fabb & Halle's theory, metrical lines are understood to instantiate "generated form," a grid-based template that counts out the line. Crucially, the basis of meter is counting, not rhythm; Fabb and Halle explicitly reject the connection of meter with rhythmic organization. Similar assumptions underly the work of Lotman (2006).
> 
> The work of Golston (1998) and Golston & Riad (2000, 2005; henceforth G&R) exemplifies the complementary approach—rhythmic and holistic. G&R observe that the apparent structure of templates can be derived from natural rhythmic constraints, and thus they are not needed in the representations. G&R view metrical texts as ordinary texts with additional phonological constraints imposed on them. Those constraints are essentially rhythmic, which makes their theory holistic and rhythmic.
> 
> Most of the remaining works in generative metrics, tacitly or explicitly, takes a rhythmic and templatic view of meter. Such is the work of Kiparsky (1975, 1977), Hayes (1983, 1988, 1989, 2009), Prince (1989), and Hanson (1991). This will also be the approach pursued here.
> 
> I take the choice between serial and rhythmic theories to be uncontroversial (see arguments in Prince 1989 against the serial view). The more difficult choice is between templates and holism. In the following section, I give arguments for a templatic approach to meter.
> 
> 1.3 Arguments for templates
> 
> G&R base their argument against a templatic theory of meter on the observation that templates tend to have unmarked structure across languages, and appear predictable from general principles of rhythm. Predictable structures, G&R argue, should be generated by grammar, not stipulated. The mechanism by which meter is generated by grammar is the same as what generates prosodic markedness: constraints like *CLASH and *LAPSE. On G&R's view, verse differs from prose in the higher ranking of prosodic markedness constraints—verse is simply prose that is prosodically less marked.
> 
> The observation that templates tend toward unmarkedness is important, but it is wrong to conclude from the partly predictable structure of templates that they don't exist. A less radical step is to develop a theory of templates which predicts their range of variation and complexity. That the unmarkedness of templates is only a tendency—sometimes they are unpredictable—makes a componential approach that treats them as analogs of underlying forms especially attractive.
> 
> In addition to this conceptual argument, there are more concrete reasons to adopt templates. The simplest, if weakest, piece of evidence is that native speakers have intuitions about templates. Listeners and readers of verse can readily generalize across several lines to produce an abstract "dee-dum-dee-dum" pattern that corresponds to its template, even if none of the lines realize it perfectly. This is more than just the ability to separate prosodic structure from segments—familiar from the reiterant speech task and tip-of-the-tongue phenomena (Levelt 1989) - but rather the ability to generalize across variants to produce an abstract underlying pattern that surface patterns resemble to different degrees.
> 
> Not only can native speakers extract templates from data, but also experience individual lines as having a dual structure of surface rhythm in tension with the ideal pattern. This experience can be overt, as in sung or chanted verse which is usually realized isochronically, or covert and unrelated to performance. Such hidden experience of underlying templates—called "interplay" by Wimsatt & Beardsley 1959—can be best illustrated by lines which fit more than one meter. For example, the familiar iambic pentameter line in (2) also scans as a dactylic tetrameter.
> 
> $$^4$$
> 
>  Even if the performance of the line in the two meters is phonetically identical, they are felt to have different structures. In a templatic theory, these two scansions have two distinct representations, depending on which metrical pattern is linked to the text. It is this covert difference that makes the line dactylic or iambic. A holistic theory has no way to represent such covert differences.
> 
> (2)  To be or not to be, that is the question
>      W  S  W  S   W  S   W    S  W   S         (iambic pentameter)
>      S  W  W  S   W  W   S    W  W   S  W      (dactylic tetrameter)
> 
> 
> 
> Another important effect—not universal across metrical traditions, but nonetheless prevalent - is the stichic behavior of templates.
> 
> $$^5$$
> 
>  Templates tend to repeat from line to line in a poem, while the details of their realization do not. Indeed, often the template is the only thing that lines in a poem share: all of the lines of an iambic pentameter poem may have different stress profiles, but they are also all, in an important sense, the same. An especially clear illustration of the distinction between templates and realization can be seen in responsion in classical verse. The chorus parts of classical Greek drama consist of stanzas which repeat the same complex quantitative metrical pattern. What counts as "same" for the purposes of responsion is tightly controlled by the template. The sequences HL (heavy-light) and HH (heavy-heavy) count as equivalent only if both are part of a trochaic meter. HH can also fill a dactylic template, but just in such a case it is no longer responsion-equivalent to HL (Raven 1962: 52, Prince 1989: 60; cf. Devine and Stephens 1975).
> 
> Furthermore, the dual structure of meter makes available two sources of structural variation. There is ample evidence that differences in templates and differences in realization are distinct. In iambic lines in many meters, the line-initial position may be filled with the main stress of a polysyllabic word, creating the appearance of a trochaic foot (e.g. in iambic pentameter lines like Nature's bequest gives nothing but doth lend, Sh.Son.4). Traditional metrics treats such cases as substitution of a trochee for an iamb (Saintsbury 1923). But there is evidence that such apparent "inversions" are in fact underlying iambs with freer realization, because they are distinct from "real" trochees in their fine-grained distribution of stress and weight (Kiparsky 2006). A holistic theory of meter has no power to express the difference between a "real" trochee and an underlying iamb that happens to look like a trochee at the surface.
> 
> Perhaps the strongest argument against metrical holism is that it makes the wrong predictions about the range of possible meters. Templates not only define the internal structure of a line, but also regulate its size by counting it out by some prosodic category. If one takes seriously G&R's idea that verse is simply prose with unusually highly-ranked prosodic markedness, the fixed-size property of lines becomes a surprise. In the holistic theory, meter results from the promotion of a markedness constraint above its usual place in the ranking, so the most natural kind of meter would be stringently rhythmic, but would lack size restrictions or counting, or indeed boundaries. The requirements of prosodic markedness—e.g. prohibition of stress lapses, or clashes, or words with final stress, or marked syllable structure, etc.—would be the only requirement in such meters. A typical poem would be a paragraph of prose with, say, no stress lapses. Since such rhythmic prose is the exception rather than the norm in the metrical traditions of the world, regulation of size and counting must be a basic property of meter, and that requires templates. (See Fabb 2002 for a discussion of the importance of counting in meter).
> 
> The arguments recited in this section support a theory that is at least weakly componential: it must have a Template Generator and a Matcher. Next I turn to the architecture of the Matcher.
> 
> 1.4 Meter as faithfulness: architecture of the Matcher
> 
> Assuming that the theory must be templatic, let me now turn to the Matcher, the core component of metrical theory.
> 
> Pretheoretically, meter is about similarity. Lines are metrical to the extent that their prosodic structure reproduces the template. A line which deviates from the prosody of the template too far can be deemed unmetrical. Metrical templates are analogous to underlying forms—they are like inputs, albeit not fully specified ones, to which the text strives to be similar. The strategy of MAF is to use OT's theory of similarity—the theory of faithfulness—to express the relationship between text and template.
> 
> Faithfulness relies on a correspondence relation between units whose similarity is being evaluated, and on ranked and violable constraints requiring various degrees and types of similarity between corresponding elements. The correspondence relation relevant to meter, which I will call template-text (TT) correspondence, is between two prosodic structures. This relation contains information on which pieces of the text fill which slots in the template. Thus, a representation of text and template with a defined TT correspondence relation is the text's metrical parse.
> 
> Mechanically, the Matcher in MAF works as follows. Inputs are pairs consisting of a template and a linguistic representation. The TT correspondence relation is not defined in the input to the Matcher, it is the Matcher's job to supply it. In the standard OT fashion, the GEN(erator) produces a set of candidate outputs, each consisting of the template-text pair with a defined TT correspondence relation between their prosodic structures. These are competing metrical parses of the line. Next, the EVAL(uator) picks the most harmonic parse, according to the meter's constraint ranking. The constraint set includes TT faithfulness constraints, which regulate similarity of prosodic structure.
> 
> One of the challenges of OT metrics is ineffability (what Hayes 2009 calls the "missing remedy" problem): some pieces of text are unmetrical in some meters, i.e. there is no optimal output. For example, the grammar should account for the fact that it is impossible parse a line like Jingle bells, jingle bells in iambic pentameter: its prosodic structure is simply too unfaithful to the template. Using a technique in OT that goes back to Prince & Smolensky 2004
> 
> $$1993$$
> 
>  and is commonly used in metrics (Friedberg 2002, Kiparsky 2006), I deal with the ineffability problem by including the null parse (Ø) in the candidate set and the constraint *NULL, violated by it, in the ranking. Ineffability results when Ø wins.
> 
> In sum, the grammar's outputs are metrical parses; the range of metrical lines is delimited by the grammar's output set; and its pattern of constraint violations can be interpreted as a measure of complexity.
> 
> The theory outlined here can be envisioned as either strongly or weakly componential. As far as the Matcher is concerned, the differences between the two are cosmetic. In a strongly componential theory, the paraphonology provides an output that becomes the input to the Matcher, which only contains metrically relevant constraints, like TT faithfulness. If the theory is weakly componential, the input to the matcher contains the underlying form of the text, not its surface form, and the phonological constraints are ranked in the same hierarchy as TT faithfulness.
> 
> The nature of the interaction of meter and phonology lies outside of the scope of this paper, and thus I will not make the choice between strong and weak componentiality. For arguments in favor of strong componentiality, see e.g. Hayes 2009.
> 
> 2. Representations and prosodic faithfulness
> 
> With the general architectural background in place, I now turn to the specifics of MAF. In this section I will go over the representational assumptions (2.1), the Template Generator (2.2), and the prosodic faithfulness theory that leads to the constraint system of the Matcher (2.3).
> 
> 2.1 Prosodic representation: EBGs
> 
> According to standard generative assumptions, speech is parsed into a hierarchical structure of prosodic constituents, which serve as loci of suprasegmental properties and as phonological domains (Selkirk 1978, 1980, 1984, Nespor & Vogel 1986, Hayes 1989, Inkelas 1989). Here I will assume the levels of mora (µ), syllable (σ), foot (φ), prosodic word (ω), and phonological phrase (P-Ph).
> 
> The most stringent constraint on prosodic structure is Strict Layering (Selkirk 1984), which requires each node to be dominated by a node of the next-highest category. Strict Layering is understood to express an unmarked configuration, not an inviolable preference; representations may deviate from the ideal (Ito and Mester 2003
> 
> $$1992$$
> 
> ; 2006). Non-strictly layered cases include adjunctions, which come in two types: with repetition and without. For example, syllables can be adjoined to feet without repetition, as in (3)a, or with repetition, as in (3)b. Syllables can also be adjoined to words (3)c.
> 
> (3)     a.  ω           b.   ω           c.   ω
>             |                |               / \
>             φ                φ              /   ω
>            /|               / \            /    |
>           / |              φ   \          /     φ
>          /  |             / \   \        /     / \
>         σ   σ            σ   σ   σ      σ     σ   σ
>         ca  noe          ca  pi  tal    a       hat
> 
> 
> 
> Annotation for Trees (3): These syntactic trees illustrate variations in prosodic adjunction.
> 
> (3)a: The weak syllable ca- in an iambic word directly adjoins to the word node (ω), bypassing the foot node (φ), demonstrating adjunction without repetition.
> 
> (3)b: The unstressed syllable -tal adjoins to a higher foot node that dominates a lower foot node spanning ca-pi, demonstrating adjunction with repetition at the foot level.
> 
> (3)c: A clitic a adjoins to a higher word node (ω) that dominates the core word hat, demonstrating adjunction with repetition at the word level.
> 
> Justification for these structures comes from the action of phonological rules, which apply within prosodic domains (Nespor and Vogel 1986). Flapping in English, for example, takes the foot as its domain, and this supports the distinction between structures like (3)a, where the initial coronal of iambic words like adórn does not flap, vs. structures like (3)b, where the t of capital is flapped (e.g. Kiparsky 1979, Jensen 2000, Davis 2005).
> 
> The lowest levels of the hierarchy cannot form adjunctions. Moras are subject to a 'confinement' condition which keeps them strictly layered within syllables. Free-standing moras cannot be dominated by feet or words, nor can syllables be parts of other syllables (Ito & Mester 2003
> 
> $$1992$$
> 
> ).
> 
> An additional requirement on well-formedness is that each prosodic constituent must have one and only one head of a next-lower category, which it dominates either directly or through other categories of the same type as itself (e.g. the higher ω in (3)c does not directly dominate a φ, but its head is the head of the lower ω it dominates).
> 
> Basic prosodic well-formedness requirements assumed here are summarized in (4).
> 
> (4) a. CONSTITUENCY Each node has one and only one mother. b. MORA CONFINEMENT Moras can only be dominated by syllables; syllables can only dominate moras or segments. c. HEADEDNESS Each node of level i, other than the lowest level, has one and only one head of category i-1, which it dominates immediately or through other nodes of level i.
> 
> In a theory with adjunction, it is possible to define two types of each prosodic category: a maximal one, which is dominated by no other category of the same type, and the minimal one which itself does not dominate any category of the same type (5) (Ito & Mester 2006). In strictly layered structures, CAT_max and CAT_min coincide.
> 
> (5) a. CAT_max not dominated by any other CAT of the same type b. CAT_min not dominating any other CAT of the same type
> 
> In the remainder of this paper, for ease of presentation, I will make use not of trees but of a notationally equivalent grid-based representation I will call ENRICHED BRACKETED GRIDS (EBGs). Grid representations commonly in use, such as those of Prince 1983, Hammond 1984, Halle & Vergnaud 1987, Hayes 1995, Halle & Idsardi 1995, etc., are not fully equivalent to trees—they may omit information on constituency and headedness, especially in structures with adjunction. EBGs are not a theoretical alternative but simply a notational variant of trees, in that they retain all of the information that trees show, but present it in a way that is more useful for prosodic correspondence.
> 
> Let us first consider structures without adjunction. EBGs consist of grid lines corresponding to the levels of the prosodic hierarchy: 1 (mora), 2 (syllable), 3 (word), etc. An asterisk at each grid line stands for a node of the corresponding level of the hierarchy. For example, a word of four syllables and two feet such as (Àri)(zóna) has four level-1 gridmarks, two level-2 gridmarks, and one level-3 gridmark.
> 
> Brackets around gridmarks at each level indicate a grouping of the nodes at that level into a constituents at the next-highest level. Gridmarks of level i+1 are positioned over the i-level head of the i+1-level constituent. A dot (.) is positioned over non-heads.
> 
> (6)     a.  * b.   * c.      * 3
>            (*)               (**)              (.  *)      2
>            (*)               (**)              (**)(**)    1
>            hat               water             A ri zo na
> 
> 
> 
> Annotation for EBGs (6): Level 1 represents syllables, Level 2 represents feet, and Level 3 represents the prosodic word (main stress).
> 
> (6)a (hat): A monosyllable where the single syllable projects to the foot and word level directly.
> 
> (6)b (water): A strictly layered trochee. Level 1 indicates two syllables (**) forming a foot, whose head projects to Level 2. The foot head projects to Level 3.
> 
> (6)c (A ri zo na): Contains two feet. Level 1 groups the syllables into (**) and (**). The secondary stress on A- projects to Level 2, but the primary stress on zo- projects through Level 2 up to Level 3. The dot . at Level 2 indicates that the first foot is a non-head of the prosodic word.
> 
> So far the EBGs are largely identical to standard bracketed grid representations, e.g. those of Hayes 1995. In structures with adjunction, the representations are "enriched" with extra bracketing. Let us walk through the three options in (3). Adjunction of a syllable to a foot is illustrated in (7)a. The fact that the initial syllable is part of the word but not the foot is shown by the bracketing. Adjunction with repetition (where a foot contains another foot, or a word another word) results in grids with nested bracketing—at the foot level, as in (7)b, or at the word level, as in (7)c.
> 
> (7)     a.  * b.   * c.      * 3
>            (.*)               (*)              (.( *))     2
>            * (*)              ((**)*)          * (*)      1
>            ca noe             ca pi tal        a  hat
> 
> 
> 
> Annotation for Enriched Adjunctions (7):
> 
> (7)a (ca noe): At Level 1, * (*) shows ca is unfooted while noe forms a foot. At Level 2, (.*) shows both syllables are gathered into the word envelope, but only the right constituent projects to Level 3.
> 
> (7)b (ca pi tal): At Level 1, ((**)*) shows a nested foot structure where -tal adjoins to the trochaic core ca pi.
> 
> (7)c (a hat): At Level 2, (.( *)) indicates a nested word structure, proving a adjoins to the phonological word hat.
> 
> Note that the HEADEDNESS requirement of (4)c is equivalent to the Continuous Column Constraint (Hayes 1995: 34), which stipulates that every gridmark at level i - i.e. an i-level constituent - sits atop a gridmark at level i-1, which is the head of that i-level constituent.
> 
> The following example illustrates a combination of various adjunctions.
> 
> (8)                 * 3                      ω
>            (.  (.   * . ))     2                     / \
>            * * ((**) * )      1                    /   ω
>            a   ca   la  mi ty                        /   / \
>                                                     /   /   φ
>                                                    /   /   / \
>                                                   /   /   φ   \
>                                                  /   /   / \   \
>                                                 σ   σ   σ   σ   σ
>                                                 a   ca  la  mi  ty
> 
> 
> 
> Annotation for Complex EBG (8): The grid precisely mirrors the tree. la mi forms the minimal foot (**) at Level 1. The syllable ty adjoins to it, forming ((**) *). ca adjoins at the word level, indicated by the inner Level 2 parenthesis (. * . ). Finally, the clitic a adjoins at the maximal word level, forming the outermost brackets (. (. * . )) at Level 2.
> 
> To summarize the assumptions about prosodic structures in English: iambic words like canoe have syllables adjoined to form words; the final unstressed syllables of words like capital and calamity are adjoined to feet with repetition; and clitics are adjoined to words with repetition. The middle syllables in words like fortification are to be adjoined rightward.
> 
> EBGs are harder to define in structures with two instances of the same category such that one dominates another and they have different heads, as in (9). For now, I simply leave them aside. They appear not to be possible in linguistic representations of stress, but do occur in templates. The "anapest" and "right-dactyl" proposed by Prince (1989: 55) are of this type. This is a notational problem, not a theoretical one, and is better left for another day.
> 
> (9)           σ_s
>              /   \
>            σ_w   σ_s
> 
> 
> 
> With the representational machinery in place, we can now turn to the content of MAF: the Template Generator, which is covered in the next section, and the prosodic faithfulness theory which forms part of the Matcher, in Section 2.3.
> 
> 2.2 Template generator
> 
> 2.2.1 Template markedness
> 
> Because MAF is componential, template theory is separate from the theory of template-text matching. Template theory is the universal theory of rhythm. As such, it does not follow from, nor is related to, the constraint ranking in the language's phonological grammar. It makes available to each language the representational vocabulary in which templates can be expressed. The set of possible templates, stated in terms of abstract prosodic structure, is the same for all languages, and the choice between them falls outside of template theory. In addition to providing the representational vocabulary, template theory expresses the markedness of templates, i.e. their degree of complexity and naturalness.
> 
> Templates are pure prosodic structure, whose representation was covered in the preceding section. However, owing to tradition, the names of the levels of the prosodic hierarchy in templates are not always identical to those in language. The following provides a rough equivalence between them, with the understanding that in particular traditions the equivalence may be different. To avoid ambiguity between stress feet and the feet of verse lines, I will refer to them as ph-feet and v-feet, respectively (abbreviating 'phonological' and 'verse'), omitting the prefix when there is no risk of ambiguity.
> 
> | GRID LEVEL | TEXT | TEMPLATE |
> | 0 | mora | mora |
> | 1 | syllable | metrical position (MP) |
> | 2 | (ph-)foot | (v-)foot |
> | 3 | prosodic word | dipody, half-line, hemistich |
> | 4 | phonological phrase | line |
> 
> Table 10: Grid level correspondences
> 
> A feature of templates that sets them aside from ordinary prosody is their underspecified character.
> 
> $$^6$$
> 
>  For one thing, templates lack segmental information. But even the prosodic structure need not to be fully articulated in a well-formed template. A template may consist only of representations at levels 1 and above, or 2 and above, and so forth. Likewise, the higher-level organization of the units of a template need not be fully specified. As a working hypothesis, let us assume that in a template the hierarchy must be continuous—that is, if it contains elements at levels i-1 and i+1, it must also contain elements at level i. I am not presently aware of counterexamples to this assumption of continuity, and it has the important advantage of making simpler the formal machinery of the Matcher.
> 
> As far as the markedness of templates, nothing new needs to be proposed here, as the theory of rhythm is well-worked out in both linguistics and music theory (Prince 1983, 1983; Jackendoff & Lehrdal 1983, Nespor & Vogel 1989). Rhythm is ideal when prominences are evenly spaced. This is normally expressed by constraints against CLASH (adjacent strong constituents) and LAPSE (strong constituents separated by strings of weak constituents).
> 
> (11) a. *CLASH-i If x and y are two adjacent i-level gridmarks, there is a gridmark at level i-1 that separates the i-1-level gridmarks that x and y dominate. b. *LAPSE-i If x and y are two adjacent i-level gridmarks, there is no more than one gridmark at level i-1 that separates the i-1-level gridmarks that x and y dominate.
> 
> Once again, these constraints are part of a universal theory of templates, not a particular language's phonological or metrical grammar. The rhythmic preferences expressed by these constraints amount to a theory of markedness of templates.
> 
> The term "Generator" (Kiparsky 1977, Hayes 2009) is perhaps a misnomer for this component of grammar, because it does not generate anything. Rather, it provides a representational vocabulary for the Matcher, and expresses the markedness of templates in terms of rhythmic preferences in (11).
> 
> 2.2.2. External factors
> 
> The upshot is that templates are formally equally marked regardless of the language in which they are used—the theory of rhythm is invariant. What, then, accounts for the obvious fact that different templates are suitable for different languages? For example, a language with obligatory initial stress is more likely to use trochaic than iambic lines; a language with long stress lapses is more likely to use templates with ternary alternations, and so on. This is a question about the connection between language and meter, and thus relates to the grounding hypothesis.
> 
> In MAF, the language-particular naturalness of templates is not due to their rhythmic (un)markedness. Following Hanson & Kiparsky (1996), MAF recognizes that there are pressures on the choices made by metrical grammar that are external to its formal properties, but at the same time well-defined enough to remain useful in metrical theorizing. These principles, called FIT and INTEREST, constrain both the choice of templates and the realization rules in such a way as to make meters both usable and aesthetically pleasing. FIT favors those meters which allow poets to use as much of the vocabulary of a language as possible. In English, a meter with poor fit would be a ternary meter which prohibits any stress (even secondary) from the weak positions. Words with adjacent stresses, which are plentiful in English, would be excluded from such a meter. In a language like Greek or Latin, an example of a meter with poor fit would be a quantitative binary meter where alternating MPs must be filled with heavy and light syllables. Any word with strings of heavies or lights—the majority of the lexicon—would be excluded.
> 
> In other words, FIT prevents meters from being too constrained. Conversely, INTEREST prefers meters not to be too loose. A meter which imposes few restrictions on the structure of the line—i.e. if random strings of prose have a high probability of satisfying its constraints- risks not being identified as meter at all. INTEREST would rule out meters consisting of, say, three prosodic words without any further constraints, or meters with indeterminate number of positions. Together, FIT and INTEREST conspire to favor meters that are neither too strict nor too loose, but occupy that optimum of difficulty which makes them usable but hard enough to be aesthetically pleasing. That optimum requires different templates and different realization schemas depending on the language.
> 
> Another example of external effects on metrical grammar is the difference between sung and written verse. Unlike written verse, where the template is covert and must be recovered by the reader, in verse that is sung to an explicit musical beat the template's structure is apparent from that beat. As a result, practically any sequence of words of reasonable length is metrical in sung verse, in the sense that it can be parsed by the template. Thus, sung verse typically has looser meters than written verse (where looseness and strictness are expressed in the constraint ranking in the Matcher). This difference in ranking is not a consequence of the formal system, but of the external conditions on performance.
> 
> From the point of view of the formal mechanics of MAF, however, all templates are equal in all languages. They act as partial underlying forms for the text, and it should not be surprising that different languages have different underlying forms.
> 
> Finally, FIT and INTEREST, together with rhythmic markedness, are not exhaustive as explanations of template choice in languages. Particular choice depend on historical accidents, the force of tradition, and other unsystematic factors which are obviously not part of the formal theory but of literary history.
> 
> 2.3 Matcher
> 
> In this section I turn to the core of MAF: the prosodic faithfulness constraints that form part of the Matcher. I begin with some general discussion of prosodic faithfulness in Section 2.3.1, propose the constraint on prominence in 2.3.2, constraints on alignment in 2.3.3, and constraint conjunction in 2.3.4.
> 
> 2.3.1 Prosodic faithfulness: general considerations
> 
> Let me start with a few examples of lines and templates. The English iambic pentameter template can be reasonably assumed to consist of ten MPs grouped into five iambic v-feet (12). It is likely that there is higher-level constituency in the meter (e.g. Hanson 2006), but it is not relevant to what follows.
> 
> (12)             * * * * * 2
>                  (* *)   (* *)   (* *)   (* *)   (* *)   1
>                  W    S    W    S    W    S    W    S    W    S
> 
> 
> 
> Line (13)a close to a perfect match between text and template: gridmarks at level 1 and 2 are in perfect correspondence. Line (13)b illustrates stressless Ss (final syllables of after, interval, and instrument), and a stress in W (initial syllable of after). The example (13)c shows the same two possibilities repeated five times. Line (13)d illustrates resolution—a single metrical position containing two syllables—and extrametricality. Finally, line (13)e has an empty strong position.
> 
> Here and in the rest of the paper, I will represent the linguistic structure above the words and the (inverted) metrical template below it.
> 
> $$^7$$
> 
> (13) a.
>                  * * * * * 3
>                  (.  (*))  (.  (*))  (.  (*))  (.  (*))  (.  (*))  2
>                  * (*)   * (*)   * (*)   * (*)   * (*)   1
>                  Of  hand, of  foot, of  lip,  of  eye,  of  brow  (Sh.Son.106)
>                  (* *)   (* *)   (* *)   (* *)   (* *)   1
>                  * * * * * 2
> 
>      b.
>                  * * * 3
>                  (* .)          (* .)          (* .)2
>                  (**)    * * (**)    * * (**)    * 1
>                  Af-     ter an      in-     ter val     his       in- stru ment (Frost)
>                  (* *)  (* *)      (* *)      (* *)(* *)   1
>                          * * * * * 2
> 
>      c.
>                  * * * * * 3
>                  (* .)   (* .)   (* .)   (* .)   (* .)   2
>                  (**) * (**) * (**) * (**) * (**) * 1
>                  ne-  ver  ne-  ver  ne-  ver  ne-  ver  ne-  ver  (Sh.King Lear)
>                  (* *)   (* *)   (* *)   (* *)   (* *)   1
>                  * * * * * 2
> 
>      d.
>                                      * * 3
>                  (.                  (* * ))    (* ) (* (*) .)    2
>                  * (**)    (* (* * ))    ((*)*)  (*) * (*) * 1
>                  This    for-ti  fi  ca-     tion        gen-tle men shall we see it (Sh.Othello)
>                  (* *)      (* *)                  (* *)  (* *)(* *)1
>                          * * * * 2
> 
>      e.
>                  * * 3
>                  (.      (* )) (*)  (*)      (*)     (*)         (.      (*)) 2
>                  * (* *) ** (*)      (*)     (*)         * (**) 1
>                  no      won- der of it sheer  plod    makes       plough  down sillion (G.M.Hopkins)
>                  (* *)      (* *)        (* *)          (* *)   (* *) 1
>                          * * * * 2
> 
> 
> 
> Annotation for Schema (13): These grids are inverted alignment models mapping Text (top) to Template (bottom). Level 1 alignments correlate syllables to Metrical Positions (W or S). Note (13)d's handling of resolution where multiple syllables e.g. for-ti share a template slot, breaking UNIFORMITY-1. Likewise, in (13)e of it sheer compresses text drastically against the W S expectation.
> 
> The job of the Matcher is to formally express the (dis)similarity between the two prosodic structures in examples such as these, by means of correspondence and faithfulness between them. Prosodic correspondence theory in phonology is poorly developed. For one thing, faithfulness appears to behave differently at different levels of the prosodic hierarchy. The orthodox view on syllable faithfulness is that it does not exist (McCarthy & Prince 1995, 1999, but cf. Elfner 2009). Faithfulness to moras, while problematic (cf. Campos-Astorkizo 2004), is needed because of underlying length contrasts. Moras are normally assumed to stand in correspondence and be subject to constraints like DEP- and MAX-µ.
> 
> In contrast, faithfulness to stress is standardly assumed to be indirect. Stress feet do not correspond to each other; instead, segments that fill them do, and faithfulness constraints refer to the roles of those segments in the prosodic constituents (McCarthy 1995, Ito, Kitagawa & Mester 1996, etc.). The argument for hitching prosodic faithfulness to segments is that higher-level prosodic constituents lack autosegment-like stability under segmental deletion, in contrast to moras which display it in phenomena like compensatory lengthening.
> 
> $$^8$$
> 
> A variety of stress faithfulness constraints have been proposed; usually they are placeholder constraints like IDENT(Stress), introduced without an explicit theory of prosodic faithfulness. The following are two examples of stress faithfulness constraints from the literature.
> 
> (14) a. HEAD-MATCH (McCarthy 1995) Input prosodic heads correspond to output prosodic heads. b. MAXFT (Itô, Kitagawa & Mester 1996) Substrings of inputs that are feet correspond to substrings of outputs that are feet.
> 
> As for higher levels of prosodic structure, I am not aware of any proposals in the literature on faithfulness to nodes above the foot level.
> 
> The piecemeal approach to prosodic faithfulness results in a patchwork of constraint types—an undesirable property, as faithfulness is OT's measure of similarity, and similarity in rhythmic or prosodic shapes of entities is no doubt linguistically relevant. What is needed is a general theory of prosodic faithfulness, and this is what I intend to propose in this section.
> 
> The need for such a theory in the context of metrics is underscored by the fact that the placeholder constraints in (14) cannot even be adapted into TT language. In IO faithfulness, the segmental content of the corresponding representations is defined. In meter, TT correspondence holds between a fully fledged representation and a deficient one—the abstract template containing only prosody. For this reason, stating TT constraints in terms of segments is meaningless. Configurations normally absent in ordinary faithfulness, such as empty metrical positions not realized with segments, are present in meter, and it is unclear how to apply the language of (14) to them.
> 
> One way out of this conundrum would be to pursue correspondence directly between prosodic constituents, or gridmarks (as was attempted in earlier version of this work, reference suppressed). This solution is undesirable for two reasons. First, correspondence between gridmarks multiplies the representational possibilities whose difference remain covert. Consider, for example, the word never occupying the WS sequence of the meter, as in (13)c. The text and template's prosody is different, but the nature of that difference is unclear, once the correspondence relation is fully spelled out. Is it the case that the level 2 gridmark of the text corresponds to a level 2 gridmark of the template dominating a different level 1 gridmark, as in (15)a? (As usual, subscripts keep track of correspondence). Or, as in (15)b, the two gridmarks do not correspond to each other? Or, do they correspond, and so do the level 1 gridmarks they dominate, as in (15)c? Each of these possibilities results in the same surface pattern, but come with different faithfulness costs. This embarrassment of representational riches should be avoided.
> 
> (15)     a.       *i      2        b.       * 2        c.      *p       2
>                  (**)     1                (**)     1               (**)      1
>                  ne ver                    ne ver                   ne ver
>                  (**)     1                (**)     1               (**)      1
>                   *k      2                 * 2                *p       2
> 
> 
> 
> The second problem with direct prosodic correspondence is much more basic: it cuts against the Grounding Hypothesis. Clearly, we should avoid a mechanism as drastically different from ordinary prosodic faithfulness as the idea of the basic units that stand in correspondence. Metrical faithfulness should follow phonology.
> 
> A way out of this impasse is to generalize somewhat the idea behind the constraints in (14), instead of attempting to translate them into TT language. For starters, note that the definition of both constraints in (14) cannot be understood literally: segments are not directly parts of feet and are not heads of feet, as (14) seems to assume. Rather, feet are composed of syllables, and the heads of feet are syllables. What (14) really means is something along the following lines: if a segment is part of syllable that is the head of a foot, then that segment's correspondent is also part of a syllable that heads a foot. In other words, the correspondence between input and output prosody is carried by the lowest level of the hierarchical structure.
> 
> The only difference with meter is which level happens to be the lowest. Let us generalize (14) to the idea that the lowest available level of structure carries correspondence. In meter, that lowest level is normally the level of the metrical position, as in the English meters discussed here. In some other meters, mora or foot or prosodic word may be the lowest level. That is the level that will serve as the locus of correspondence between template and text. I will refer to the grid level at which the TT correspondence relation holds as the correspondence level, or the c-level. Gridmarks (i.e. prosodic constituents) at that level stand in TT correspondence: metrical positions correspond to syllables. Correspondence on the other levels of the hierarchy is not enforced directly, but via the c-level, in the manner of (14), in the way made more precise in the following section.
> 
> This principle is to be understood as a constraint on GEN. Structures are well-formed—and therefore produced by GEN- only if the correspondence holds at c-level. Representations with correspondence between higher nodes are simply not part of the competition.
> 
> 2.3.2 Prosodic faithfulness: constraints on prominence
> 
> Let us assume, as outlined in the preceding section, that correspondence holds between nodes of the prosodic hierarchy at the c-level. Correspondence between higher levels in the hierarchy is mediated by the c-level. The prosodic correspondence relation (p-correspondence) is defined formally as follows.
> 
> $$^9$$
> 
> (16) a. BASE OF A GRIDMARK The base of a gridmark x, written B(x), is the c-level gridmark x dominates. b. P-CORRESPONDENCE Let R be a correspondence relation, and x and y are gridmarks. Then x and y stand in p-correspondence, written ℜ_p, if either xRy or B(x)ℜB(y).
> 
> The notion of Base is well defined for each gridmark, because, by (4)c (which is equivalent to the Continuous Column Constraint), each gridmark dominates a gridmark of a lower level. By transitivity, each gridmark has a Base. Therefore, ℜ_p is defined between any two gridmarks.
> 
> The following diagram illustrates ℜ_p with i as the c-level. Correspondence between higher levels of the structure hitches a ride on c-level correspondence. This is simply a generalized version of the idea behind (14). The constraints are defined in (18).
> 
> (17)                           * <----------> * (i+2)
>                                ^     ℜ_p      ^
>                                |              |
>                                * * (i+1)
>                                |              |
>                   (c-level)    * <----------> * (i)
>                                       ℜ
> 
> 
> 
> (18) a. MAX-i If x is an i-level gridmark in the input, there is an output i-level gridmark y such that xℜ_py. b. DEP-i If y is an i-level gridmark in the output, there is an input i-level gridmark x such that xℜ_py.
> 
> In the case of ordinary input-output correspondence, the constraints in (18) reduce to constraints similar to (14). MAX-2, for example, means that input stressed segments correspond to output stressed segments, just as (14)a says.
> 
> In the case of TT, let us assume 'input' to mean 'template', and 'output' to mean 'text'. In the generalized case relevant to meter, where the c-level is higher than segmental, the schemata in (18) produce metrically interesting constraints. In English iambic meters, the c-level is the syllabic (or MP) level. In that system, MAX-1 means that each MP corresponds to a syllable, and DEP-1 that each syllable corresponds to an MP. Violation of MAX-1 is an empty metrical position; violation of DEP-1 is a syllable that does not fit into a slot in the template, i.e. an extrametrical syllable.
> 
> MAX-2 and DEP-2 can be unpacked as follows.
> 
> (19) a. MAX-2 If x is a v-foot, its head MP corresponds to a syllable that heads a ph-foot. b. DEP-2 If y is a ph-foot, its head syllable corresponds to an MP that heads a v-foot.
> 
> MAX-2 is violated whenever a strong MP is not filled with a stressed syllable - i.e. whenever it is empty, or is filled with an unstressed syllable. Conversely, DEP-2 would penalize a stressed syllable which is not in a strong position—either because it is in a weak position, or because it is extrametrical.
> 
> Another set of basic faithfulness constraints are the UNIFORMITY family constraints that militate against one entity in the input corresponding to multiple entities in the output.
> 
> (20) UNIFORMITY-i If x is an input i-level gridmark and y is an output i-level gridmark and xRy, then there is no z such that z is an output i-level gridmark, xℜ_pz and z ≠ y.
> 
> In the English meters, UNIFORMITY-1 is violated whenever a metrical position contains more than one syllable in it—a configuration called resolution (cf. (13)d). It is representationally distinct from extrametricality, as shown below. Subscripts keep track of correspondence. In the first example, the word water occupies an entire metrical position (and thus violates UNIFORMITY-1); in the second case, only its first syllable occupies the metrical position, while the second syllable exists outside of the template, violating DEP-1.
> 
> (21)     a. Resolution                       b. Extrametricality
>              * 2               * 2
>              (*_i,j *)            1               (*_k)                1
>              wa     ter                           wa     ter
>              (*_i,j *)            1               (*_k)                1
>              * 2               * 2
> 
> 
> 
> The constraints introduced so far are summarized below.
> 
> (22) a. MAX-1 'No empty positions' b. DEP-1 'No extrametricality' c. UNIFORMITY-1 'No resolution' d. MAX-2 'Strong positions are filled with a stressed syllable' e. DEP-2 'Stressed syllables are not in weak positions'
> 
> Just as other faithfulness constraints, TT constraints can be positional, in the sense of Beckman 1998. While ordinary constraints regulate any prosodic nodes stand in p-correspondence, positional constraints single out those nodes which are strong.
> 
> Positional faithfulness as usually employed in phonological analysis protects segmental properties in prosodically prominent positions (Beckman 1998, de Lacy 2001). The situation in TT correspondence is somewhat different, because the relation holds between purely prosodic structures, but the rationale is: strong positions enjoy extra protection.
> 
> The notion of strength can be defined most simply as headedness: a gridmark that is dominated by a gridmark at some higher level—and thus heads that higher-level constituent—is strong. Both MAX and DEP constraints can be relativized to such strong positions. Each positional MAX and DEP thus must refer to two levels in the prosodic hierarchy. MAX_P-i,j, for example, would require an input i-level gridmark to have an output correspondent whenever that input i-level gridmark heads an input j-level constituent.
> 
> The two families of constraints are defined below.
> 
> (23) a. MAX_P-i,j (where i<j) If x is an input i-level gridmark that is dominated by an j-level gridmark, then there is an output i-level gridmark y such that xℜ_py. b. DEP_P-i,j (where i<j) If y is an output i-level gridmark that is dominated by an j-level gridmark, then there is an input i-level gridmark x such that xℜ_py.
> 
> As usual with positional faithfulness, the effect is to single out the worst violations. Let us again consider English iambic meters with c-level = 1 to exemplify the constraints. Ordinary MAX-2 covers any situation where a strong position does not contain a stressed syllable. Of these, ones where the strong position is filled with an unstressed syllable are comparatively better than ones where the strong position is empty. MAX_P-1,2 only penalizes the latter, most egregious violations of MAX-2: it protects strong positions (level 1 gridmarks dominated by level 2 gridmarks) from being unfilled by a syllable.
> 
> Conversely for DEP, the positional DEP_P-1,2 is violated by stressed extrametrical syllable—the worst violators of DEP-2.
> 
> MAX_P-1,3 would penalize those empty strong positions which are themselves heads of a higher-level constituent, i.e. the dipody heads. DEP_P-1,3, conversely, penalizes the primary stress of a word from being extrametrical. DEP_P-2,4 penalizes the primary stress of a phrase from occupying a weak position. The following tables summarize the meanings of the positional constraint family in English-like meters.
> 
> |  | 2 | 3 | 4 |
> | 1 | No empty S | No empty dipody heads | No empty line heads |
> | 2 |  | No unstressed dipody heads | No unstressed line heads |
> | 3 |  |  | No non-primary-stressed line heads |
> 
> Table 2: MAX_P constraint family
> 
> |  | 2 | 3 | 4 |
> | 1 | No extrametrical stress | No extrametrical primary stress | No extrametrical phrasal peak |
> | 2 |  | No primary stress in W | No phrasal peak in W |
> | 3 |  |  | No phrasal peak in non-dipody head |
> 
> Table 3: DEP_P constraint family
> 
> Note that not all the constraints are in fact "useful"—i.e. observed in action in actual metrical systems. Some of the constraints describe situations so marked that they are hardly ever observed, e.g. empty line heads or extrametrical phrasal peaks.
> 
> Uniformity may also be positional, as defined below.
> 
> (24) UNIFORMITY_P-i,j If x is an input i-level gridmark that is dominated by a j-level gridmark, and y is an output i-level gridmark and xℜ_py, then there is no z such that z is an output i-level gridmark, xℜ_pz and z ≠ y.
> 
> Relativizing UNIFORMITY to strong positions can account for the distinction in resolution (which violates Uniformity) between strong and weak positions. UNIFORMITY_P-1,2, for example, is violated by resolution in S, UNIFORMITY_P-1,3 by resolution in dipody heads, etc.
> 
> I leave it as an open question whether positional constraints other than those defined here are needed. One additional constraint family that is plausible would use a different notion of strength than (23). Consider the following structure, represented as both a tree and a grid.
> 
> (25)                 3
>              (   * )           2
>              (* *)  (* *)      1
>              W   S   W   S
> 
> 
> 
> MAX_P constraints single out those positions which are heads of some constituent. MAX_P-1,2, for example, applies to the two strong positions; MAX_P-1,3 only to the first (strongest) one. However, using (23), there is no way to single out the first two positions of the four depicted in (25): that is, all the members of the strong branch of the level 3 constituent. Such constraints would be useful, both in language and meter. For example, in Greek and Latin quantitative meters, the strong branches of dipodies are subject to more stringent constraints than weak branches of dipodies (Prince 1989). In language, such a constraint would, for example, protect the content of the strongest foot of a word. Positional prosodic MAX and DEP relativized to strong branches are a plausible constraint family to pursue, but in the interest of focus, I will not do so in this paper (though see Section 4.3 below).
> 
> 2.3.3 Prosodic faithfulness: constraints on constituency
> 
> The MAX and DEP constraints, together with their progeny defined in the preceding section, are not sufficient to characterize all differences between text and template. For instance, the following example incurs no violations of any constraints so far defined, because the prominence structures match.
> 
> (26)         * 2
>              (**)     (**)   1
>              tepid    wa ter
>              (* *)  (* *) 1
>                   * * 2
> 
> 
> 
> Annotation for Constituency (26): Though prominence matches (unstress, stress, unstress, stress mapped onto W S W S), the bracketing (foot boundaries) of the text (**) (**)  versus the template (* *) (* *) misaligns structurally.
> 
> The text and template in (26) differ in bracketing. Such differences are metrically relevant (Kiparsky 1975, 1977), and must therefore violate some constraint in the Matcher. Constraints on constituency come from the ALIGN family (McCarthy & Prince 1993), requiring edges of prosodic and metrical constituents to be situated next to corresponding gridmarks. The general definition of prosodic alignment is given below; it requires an extension of the notion of Base.
> 
> (27) BASE OF A GRIDMARK (extended definition) The base of a gridmark x, written B(x) is (a) the c-level gridmark x dominates, if x is above the c-level (b) otherwise B(x) = x.
> 
> (28) ALIGN(i,j,E); E ∈ {L,R} For each input i-level gridmark x, if B(x) is at edge E of an i-level constituent, then there is an output j-level gridmark y such that xℜ_py and B(y) is at edge E of a j-level constituent.
> 
> Considering four prosodic levels in the templates and texts (syllable, foot, word, phrase), the ALIGN family contains 16 constraints, not all of which are interesting. Some are almost universally inviolable, e.g. ALIGN(4,1,L) prohibiting metrical lines from beginning inside a syllable. Others are so restrictive that they are always dominated, e.g. ALIGN(1,4,L) requiring each metrical position to begin a new phonological phrase. Generally, constraints are useful when the difference between the aligned levels is not great. The following table summarizes the possibilities; the shaded cells correspond to constraints that impose reasonable restrictions that some (but not all) meters employ, spelled out in (29).
> 
> |  | syllable (1) | foot (2) | word (3) | phrase (4) |
> | MP (1) | almost inviolable | (29)a | too restrictive | too restrictive |
> | foot (2) | almost inviolable | (29)b | (29)c | too restrictive |
> | dipody (3) | almost inviolable | (29)d | (29)e | (29)f |
> | line (4) | inviolable | inviolable | almost inviolable | (29)g |
> 
> Table 4: ALIGN family
> 
> (29) a. ALIGN(1,2,L) 'Each metrical position is left-aligned with a ph-foot' b. ALIGN(2,2,L) 'Each v-foot is left-aligned with a ph-foot' c. ALIGN(2,3,L) 'Each v-foot is left-aligned with a word' d. ALIGN(3,2,L) 'Each dipody is left-aligned with a ph-foot' e. ALIGN(3,3,L) 'Each dipody is left-aligned with a word' f. ALIGN(3,4,L) 'Each dipody is left-aligned with a phrase' g. ALIGN(4,4,L) 'Each line is left-aligned with a phrase'
> 
> An unresolved question on the ALIGN family of constraints concerns directionality. They are defined here in the input-output direction, i.e. they require each input (template) constituent to be aligned with some output constituent. Nothing in principle excludes the opposite: requiring each output (text) constituent to be aligned to some constituent in the template, e.g. constraints like 'Each word must begin a new dipody'. Whether such constraints are actually needed remains an open question.
> 
> 2.3.4 Local conjunction
> 
> One more extension of the standard constraints is necessary: local conjunction (Prince & Smolensky 2004
> 
> $$1993$$
> 
> ; Łubowicz 1999; Itô & Mester 1998, 2003).
> 
> Local conjunction assigns greater cost to multiple violations within a domain. The constraint NOFLOP (cf. Alderete 2001), defined below, is violated whenever there is both a MAX and a DEP violation within some prosodic domain in the text, e.g. a phonological word or a phrase.
> 
> (30) NOFLOP-i_d There is a violation of MAX-i and DEP-i within a d-level domain in the text.
> 
> In standard English meters, NOFLOP-2 is violated whenever a prosodic word contains at least one stressed syllable occupying a weak position and one unstressed syllables occupying a strong position. For example, a trochaic word like water occupying WS, or an iambic word like canoe occupying SW, would violate NOFLOP-2. The domain can be specified as MAX or MIN (see (5) above).
> 
> 3. Application to English meter
> 
> Now I turn to applying the tools developed above to the analysis of concrete metrical systems. First, a few general remarks are in order on what an analysis in MAF looks like. Since the unit of evaluation in the grammar is the line, a complete analysis of a meter would show how all possible types of lines behave under a given constraint ranking, and how that behavior compares with the observed corpus. For example, the study by Hayes (2005) analyzed the relatively small corpus of chanted verse at the level of the line.
> 
> However, as a practical matter it is not usually possible, at least by hand, to construct a grammar of an entire corpus of a meter such as English iambic pentameter. The number of possible line types is simply too large, and the corpus too complex and variable. In this paper, I will not make such an attempt.
> 
> Rather, a more productive strategy is to isolate and account for local metrical options, i.e. the metrical types not of entire lines, but of line fragments. This is not a new strategy: it was used in virtually all pre-OT approaches. For example, the metrical grammars of Halle & Keyser (1966, 1971), Kiparsky (1977), or Hayes (1983) describe the behavior of various types of word stress in weak and strong positions of the line—i.e. most of their constraints deal with word-sized line fragments, not the structure of lines in toto. Such a localist approach works to the extent that the metrical choices in various parts of the line are independent of each other. The analysis below will be localist in this sense.
> 
> I will start with four of most general metrical options relevant to English meter, which form the core of the system: the availability of stress in W of monosyllables vs. polysyllables; the availability of polysyllabic stress in W depending on alignment; the availability of phrasal peaks in W; and resolution. These metrical options are relevant in the sense that for each one, at least some authors actively avoid the marked variant. For example, some poets allow both monosyllabic and polysyllabic stresses in W, while others only allow monosyllabic stress. Polysyllabic stress in W is the marked variant that is avoided by some, but not all, poets.
> 
> For each metrical option, I will show how the constraint system can be used to account for it. This means demonstrating a ranking which excludes lines containing the metrical types being avoided. Second, using techniques derived from the Multiple Grammars Theory (MGT), I will show how the metrical options interact with each other, i.e., whether any implicational relationships are predicted between them.
> 
> In sections 3.1-3.5, which deal with the core of the system, I abstract away from the gradient and variable nature of the data. In Section 3.6 I will turn to a detailed study of one of the metrical options, phrasal peaks in W, and show how an analysis in MAF can incorporate gradient effects.
> 
> 3.1 The Monosyllable Principle
> 
> I start with the most basic fact relevant to English iambic meters. Descriptively, S is unregulated, while W (in the first approximation) cannot contain stresses of polysyllabic words (Jakobson 1979
> 
> $$1923$$
> 
> ; Halle & Keyser 1966, etc.). Stressed monosyllables, on the other hand, are allowed in W. I will call this the Monosyllable Principle. The empirical details surrounding it were at the focus of various studies of English in generative metrics. Halle & Keyser's notion of Stress Maximum, as well as Kiparsky's notion of Lexical stress, both make representational distinctions between two kinds of stresses that roughly correspond to the monosyllable/polysyllable division, and make their metrical constraints sensitive to that distinction. In the OT context, Hayes encodes the Monosyllable Principle into the constraint MATCH STRESS (31). The last line of the constraint's definition—that two syllables under evaluation occupy the same word—is equivalent to a version of the Monosyllable Principle.
> 
> (31) MATCH STRESS (Hayes 2009: 134) Assess a violation if σ_i and σ_j 
> 
> $$...$$
> 
>  are linked to grid positions G_i and G_j, respectively; σ_i has stronger stress than σ_j; G_j is stronger than G_i; σ_i and σ_j occupy the same simplex word.
> 
> What is in common between such accounts of the Monosyllable Principle is that it does not follow from anything—whether through representations or metrical constraints, the effect must be stipulated. In MAF, on the other hand, it is a consequence of the constraint system as defined above; nothing needs to be added to account for it. Consider first the simplest distinction between stressed monosyllabic words in W like night and longer words like morning with its stress in W. The monosyllable violates DEP-2 (32)a, while polysyllabic stress also violates MAX-2 (32)b. Because both violations are within the same phonological word, (32)b also violates their local conjunction within that domain, i.e. NOFLOP-2.
> 
> (32)     a.       * 2        b.       * 2
>                  (*)       1                (**)      1
>                  night                      morning
>                  (* 1                (**)      1
>                            2                 * 2
>                  (DEP-2)                    (DEP-2; MAX-2; NOFLOP-2)
> 
> 
> 
> Tallying the violations within the prosodic word, morning in WS incurs a superset of the violations of night in W, and is thus metrically more marked. The ranking NOFLOP-2 *NULL >> MAX-2; DEP-2 would produce a grammar that tolerates stressed syllables in W and unstressed syllables in S, but not both in the same word—precisely the Monosyllable Principle. Conversely, it is impossible to derive a grammar where (32)b is allowed but (32)a is not.
> 
> The constraints predict more fine-grained distinctions. Not all secondary stresses in weak positions are equal: those of words like màintáin are more acceptable than those of words like fòrtification (Kiparsky 1977). The violation pattern of the constraints accounts for this distinction. Because in fortification the presence of the secondary stress in W correlates with its absence in S, the word violates the local conjunction of DEP and MAX, while that is not the case in maintain.
> 
> (33)     a.       * 3   b.       * 3
>                  (**)           2           (* * )    2
>                  (*) (*)        1           (**) (*(**))   1
>                  maintain                   for ti fi ca tion
>                  *) (* 1           (**) (**) (* 1
>                  * 2           * * 2
>                  (DEP-2)                    (DEP-2; MAX-2; NOFLOP-2)
> 
> 
> 
> The version of the Monosyllabic Principle predicted by MAF is as follows: a stress is excluded from W just in case there is an unstressed syllable in S in the same phonological word.
> 
> 3.2 Trochees in WS
> 
> The second metrical option I will discuss is related to the Monosyllable Principle. For some poets, that effect is absolute; others allow some but not all polysyllabic stress in W. Kiparsky (1977), following the investigation by Buss (1974), showed that Milton allows violations of the Monosyllable Principle only if there is no mismatch between the metrical and phonological bracketing. For example, if a trochaic word like gården occupies the WS sequence (contra the Monosyllable Principle), its boundaries are aligned with the boundaries of the v-foot (34)a. But if the Monosyllable Principle is contravened by an iambic word like behold, there is a misalignment between the boundaries of the v-foot and the word (34)b. I will refer to the former case as a WS flop and the latter as an SW flop.
> 
> (34)     a. WS flop                 b. SW flop
>                   * 3                    * 3
>                  (*)    2                   (.     *)    2
>                  (**)   1                   * (*)    1
>                  gar den                    be    hold
>                  (**)   1                   (* *)     1
>                   * 2                          * 2
> 
> 
> 
> As has been observed by Kiparsky, Buss, and others, configurations like (34)b are more avoided by poets than those like (34)a. Milton, for example, allows WS flops but not SW flops. Once again, this distinction follows from the constraint system. The configuration in (34)b incurs a categorically worse set of constraint violations than (34)a: it violates ALIGN(2,3,L) 'Each v-foot is left-aligned with a phonological word'. The ranking ALIGN(2,3,L) >> *NULL >> NOFLOP-2 will produce a grammar where WS flops are allowed while SW flops are not—Milton's grammar.
> 
> A grammar where (34)a is ruled out but (34)b is allowed cannot be derived using these constraints.
> 
> 3.3 Phrasal peaks in W
> 
> The next metrical option to be discussed is the availability of phrasal peaks in W. Phrasal peaks are the strongest stresses of the phonological phrase. I will limit the discussion in this section to those peaks which are final in their phrase. Phrase boundaries are defined according to standard phonological criteria, investigated in Nespor & Vogel 1986 and subsequent literature (see e.g. Selkirk 1995, and refs. therein). In English, modifiers phrase with their head nouns; subjects do not phrase with verbs; verbs phrase with objects optionally, especially if the object is heavy. For the purposes of this study, I will assume that verbs do not phrase with objects except if the object is an unstressed pronoun. Stressed syllables at the end of phrases thus defined are phrasal peaks.
> 
> As peaks are stronger than other stresses, W position filled by a phrasal peak is more marked than W filled with non-peak stressed syllable. Milton, for example, who is permissive with respect to stressed Ws (see above), prohibits phrasal peaks in W almost categorically in Paradise Lost, and allows very few of them in his earlier poems (Buss 1974).
> 
> In addition to violating all the constraints that stress in W otherwise violates, phrasal peaks also violate the positional constraint DEP_P-2,4. Because they have a superset of violations of unstressed syllables in W, MAF correctly treats phrasal peaks in W as being categorically more marked.
> 
> 3.4 Resolution
> 
> The final metrical option to be considered here is resolution (two syllables occupying a single metrical position). The violation profile depends on whether resolution is in S or W. Both resolution types violate UNIFORMITY-1, which directly militates against one-to-many correspondence. Resolution in S contains an unstressed syllable in a strong position, and thus violates MAX-2. It also violates the positional UNIFORMITY_P-1,2 (see (24) above). Resolution in W violates DEP-2, because it contains a stressed syllable in a weak position.
> 
> The literature on resolution demonstrates that in English, as in many other languages, there is a strong, usually inviolable, preference to allow two syllables to stand in resolution if they form a ph-foot (Hanson 1991). This preference is expressed by the constraint ALIGN(1,2,L) (cf. (29)a). I will not entertain resolutions that violate this alignment preference—assuming, in other words, that the constraint that they violate is undominated.
> 
> 3.5 T-order
> 
> In this section I will summarize the predictions of MAF using the MGT technique known as t-order (Anttila and Andrus 2006). This technique makes perspicuous the relationships between the choices in metrical options by assessing their relative markedness.
> 
> Constraint violations for each metrical type (i.e. the marked variant) are summarized in the following table. Only relevant constraints are listed - i.e. those that distinguish types from each other. Constraints like DEP-1 or MAX-1 are not mentioned because they are not violated by these metrical types. This is a table, not a tableau: it simply lists the violations.
> 
> |  | DEP-2 | MAX-2 | NOFLOP-2 | ALIGN(2,3,L) | DEP_P-2,4 | UNI-1 | UNI_P-1,2 |
> | stress in W | * |  |  |  |  |  |  |
> | unstress in S |  | * |  |  |  |  |  |
> | WS flop | * | * | * |  |  |  |  |
> | SW flop | * | * | * | * |  |  |  |
> | phrasal peak in W | * |  |  |  | * |  |  |
> | resolution in S |  | * |  |  |  | * | * |
> | resolution in W | * |  |  |  |  | * |  |
> 
> Table 5: violation patterns
> 
> The next step is to construct a factorial typology of the system in Table 5. I will produce it using a tableau with two candidates for each type: a "yes" candidate which violates the constraints as listed in the table, and a "no" candidate which violates only *NULL. In other words, the metrical parse assumed in Table 5 competes with the null candidate.
> 
> This is an idealization, because in reality each candidate set is infinitely large, and contains not only the assumed metrical parse, but all other possible parses as well. The idealization is not problematic to the extent that it can be shown that all other non-null candidates are worse than the assumed parse.
> 
> This is demonstrably true for all inputs under discussion. Setting aside the resolution cases, there are as many syllables in the text fragment as metrical positions in the template fragment. Thus, any alternative metrical parse to what is shown in Table 5 would involve an empty position, which is categorically excluded due to undominated MAX-1.
> 
> As for resolution, there is always the possibility of shifting one of the resolved syllables to a neighboring metrical position. However, such an alternative parse would violate the alignment between feet and metrical positions, which is also assumed to be inviolable (see Section 3.4 above). Therefore, all parses other than those implied by Table 5 violate undominated constraints, and it is thus possible to idealize the set to just two candidates.
> 
> The factorial typology is produced using the OTSoft program (Hayes, Tesar & Zuraw 2003). The relevant information in the factorial typology is the implicational relationships between metrical types, i.e. information like "if X occurs in a dialect, then Y occurs in it, too." The ensemble of such implicational statements induces a partial order on the outputs, known as t-order—a concept that has been developed within MGT (Anttila 2000, 2006, 2007). It can be extracted automatically using T-Order Generator software (Anttila & Andrus 2006), and can be represented by a graph, as follows.
> 
> (35)                                SW flop
>                                        |
>   resol/W         peak/W            WS flop                   resol/S
>      \              |                 / \                       /
>       \             |                /   \                     /
>        \            |               /     \                   /
>         \---> monosyll/W <---------/       \-----> unstress/S
>                     \                                /
>                      \                              /
>                       \----->  { stress/W } <------/
>                                { unstress/S }
> 
> 
> 
> Annotation for T-Order Graph (35): In this MGT structure, nodes higher in the lattice are more marked. If a higher node is present in a specific metrical grammar, all lower nodes connected below it must also be present. SW flop is the most marked configuration and rests atop the hierarchy, implying that a poet allowing an SW flop (like behold across a foot boundary) must logically allow WS flop, monosyll/W, etc.
> 
> If two nodes are connected by a line in the graph in (35), the higher node occurs in a subset of dialects compared to the lower node. This graph, then, illustrates the relative markedness of metrical types: the higher in the graph, the more marked.
> 
> Assuming (with idealization) that each poet's grammar is a strict ranking of the constraints in Table 5 and *NULL, the t-order graph in (35) is a summary of MAF's predictions for the range of possible metrical grammars. In particular, no poet should employ a metrical type without also employing all types dominated by it in (35), because no ranking of the constraints can produce such a grammar.
> 
> The predictions of (35) correspond to the facts as described in the classic literature. The bottom layer of the graph represents the unmarked options that are never avoided in any metrical grammar. The second layer is also generally inviolable. Monosyllabic stress in W is sometimes rare or avoided in trochaic meters (which are strict with respect to all the other metrical options), but not in iambic meters. Unstressed syllables in S are generally allowed in iambs, but avoided in what is known as strict stress meter, or dolnik (Tarlinkaja 1976, 1993).
> 
> The only implicational relationship predicted by (35) is between WS and SW flops: the latter only occurs in dialects where the former occurs as well. This agrees with the observations of Buss (1974) and Kiparsky (1977). Milton allows only WS flops, while the less strict poets like Donne and the Tudor poets (Wyatt and Surrey) allow both types of flops.
> 
> Equally important is the opposite prediction of (35): if two types are not in a dominance relationship in the t-order, they are predicted to occur independently. For example, this is the case for peaks and flops. Indeed, the classic literature supports the claim: Shakespeare allows peaks but not flops, while Milton shows the reverse behavior. Likewise, the occurrence of resolution in W is independent of the occurrence of resolution in S, and both are independent of peaks and flops (cf. Hanson 1991).
> 
> A variety of iambic meters called iambic-anapestic (Hanson 1991) routinely allows resolution in W, but neither peaks nor flops. Conversely, some poets who allow peaks or flops routinely prohibit resolution in W, such as Shakespeare or Milton. This illustrates the independence of those types, as well as the independence of resolution in W and resolution in S, also allowed by Shakespeare.
> 
> In sum, the discussion in this section illustrates an analysis of a system in MAF. The analysis proceeds by examining local metrical options, and establishing the predictions of the constraint system in terms of the typology of those metrical options. A significant advantage of the theory is that the Monosyllable Effect, which previously had to be stipulated, follows from the constraint system itself.
> 
> In the following section, I examine three patterns in more detail: English phrasal peaks in W; English stress in W; and Latin hexameter endings.
> 
> 4 Further cases studies
> 
> 4.1 Phrasal peaks in W
> 
> 4.1.1 Metrical types and data
> 
> In this section I will take a closer look at a subset of the metrical types discussed above: phrase-final peaks in W (see Section 3.3). Once again, we begin by identifying metrical types and their violation profiles.
> 
> The metrical types will vary the leftward context of the phrasal peak, as this context is known to influence its acceptability. Generally speaking, peaks in W are improved if the preceding syllable is relatively prominent (Kiparsky 1977, Schlerman 1989). This tendency is a species as the Monosyllable Principle: within a domain, a stress in W coinciding with an unstress in S is a greater departure from the underlying rhythm than stress in W alone.
> 
> For the set of metrical types, let us take as a starting point Schlerman's (1989) investigation of phrasal peaks in two plays by John Webster, White Devil and The Duchess of Malfi. In the examples in (36), the relevant portion of the line is underlined; the last syllable of the underlined portion is the phrasal peak. The peak is preceded by the unstressed syllable of a polysyllable in (36)a, by a prosodically similar sequence consisting of a word and a clitic in (36)b, by two clitics in (36)c, by the stress of a polysyllable in (36)d, and by a stressed monosyllable in (36)e.
> 
> In the following examples, the stressed peak in W is capitalized.
> 
> (36)
> a. Even with thy prodigal BLOOD; what hast got?     White Devil 3.1.40
>      S    W    S   W SWS    W      S    W
> 
> b. Better than tribute of WOLVES paid in England    White Devil 4.1.71
>    W S    W    S W S   W  S      W    S  (w)
> 
> c. The cause of my DEATH, rather than a doctor      White Devil 5.6.234
>    W   S     W  S  W      S W    S    W S(w)
> 
> d. You have conveyed CORN forth our territories     White Devil 5.3.82
>    W   S    W S      W    S     W   S  W S
> 
> e. Discovers flocks of wild DUCKS, then, my lord    White Devil 2.1.89
>    W S W S   W      S  W    S      W     S
> 
> 
> 
> I will also consider two other types, not used by John Webster: peaks preceded by a stressed monosyllable and a clitic (37)a, and peaks which are themselves stressed syllables of polysyllabic words (37)b. Such examples occasionally occur in other authors, such as Shakespeare. Between (36) and (37), I will analyze seven types of peaks.
> 
> (37) a. Sweets with SWEETS war not, joy delights in joy   Sh. Son. 8
>         W      S    W      S   W    S   W S      W  S
> 
>      b. Should beCOME kings of Naples? O, rejoice         Sh. Tempest 5.1
>         W      S W    S     W  S W     S  W S
> 
> 
> 
> The EBGs for the seven types and their alignment to the meter are shown in (38).
> 
> (38)
>                  * 4                    * 4
>                  (*.  *)   3                    (*) (. *) 3
>                  (*)(.(*)) 2                    (*)(. (*))2
>                  (**) *(*) 1                    (**) * (*)1
>             prodigal BLOOD             tribute of WOLVES
>             (* *)(* *) 1               (* *)(* *)  1
>                  * * 2                   * * 2
> 
>                  (.   *)   4                    .    .* 4
>                  (.   *)   3                    (. * *)  3
>                  (.(.(*))) 2                    (..(*))(*)2
>                  * * (*) 1                    * (*) (*)1
>                of my DEATH                 of wild DUCKS
>                  (**) (* (**) (*
>                    * *
> 
>                  .    * 4                    * . * 4
>                  (.* *)   3                    (*)  (.*) 3
>                  (.*) (*)  2                    (*)  (.(*))2
>                  * (*) (*) 1                    (*)  * (*)1
>              conveyed CORN                 sweets with SWEETS
>                  (**) (* (* *) (*
>                    * *
> 
>                  .    .* 4
>                  (.   .*)  3
>                  (.   .(*))2
>                  * *(*) 1
>              should beCOME
>                  (* *) (*
>                       *
> 
> 
> 
> Annotation for EBGs (38): These schema outline seven discrete topological realities for phrasal peaks falling into W slots across an underlying iambic matrix. Observe the alignment of the peak word onto the (* of the template (W position). Notice in should beCOME that the iambic word beCOME (* *) is forced onto a (* *) template sequence spanning a foot boundary, making it an SW flop structure combined with a phrasal peak in W.
> 
> Next, let us go through the constraints that distinguish the seven metrical types. MAX-2 is violated in all cases where the S preceding the peak is not filled with a stress, i.e. in all but of wild DUCKS and conveyed CORN. DEP-2 is violated once by each example on account of its peak in W. The type sweets with SWEETS contains another violation because the stressed syllable of the first sweets occupies W.
> 
> ALIGN(2,3,L) militates against v-feet which are not left-aligned with phonological words. It is violated by the type should beCOME, which contains a SW flop (see Section 3.2 above), and by prodigal BLOOD and tribute of WOLVES, whose first words span a v-foot boundary.
> 
> The mirror version of the same constraint, ALIGN(2,3,R), is also violated by the same three types, should beCOME, prodigal BLOOD, and tribute of WOLVES, where a right ph-foot boundary occurs inside a word. It is also violated by any type where a right ph-foot boundary is preceded by a clitic and followed by a word. These are tribute of WOLVES (adding a second violation for this type), of my DEATH, and sweets with SWEETS. In these cases, the right v-foot boundary is inside the phonological words of WOLVES, my DEATH, and with SWEETS, respectively. Thus, tribute of WOLVES violates the constraint twice: once for the right v-foot boundary inside tribute, and once for of WOLVES.
> 
> NOFLOP-2 is violated by the type with a SW flop, should beCOME.
> 
> NOFLOP-2_phr is violated by any type where a phrase contains both a DEP-2 and a MAX-2 violation: the types prodigal BLOOD, of my DEATH, and should beCOME.
> 
> These violations are summarized in the following table.
> 
> |  | MAX-2 | DEP-2 | ALIGN(2,3,L) | ALIGN(2,3,R) | NOFLOP-2 | NOFLOP-2_phr |
> | prodigal BLOOD | * | * | * | * |  | * |
> | tribute of WOLVES | * | * | * | ** |  |  |
> | of my DEATH | * | * |  | * |  | * |
> | of wild DUCKS |  | * |  |  |  |  |
> | conveyed CORN |  | * |  |  |  |  |
> | sweets with SWEETS |  | ** |  | * |  |  |
> | should beCOME | * | * | * | * | * | * |
> 
> Table 6: violation patterns
> 
> 4.1.2 MGT and t-order
> 
> Next, I turn to the mechanics of the model. The setup presented in Section 3.5 was necessarily crude. Its two-way distinction between metrical and unmetrical lines is too coarse-grained for insightful analysis of detailed metrical patterns, such as phrasal peaks, because, crucially, most metrical types are metrical for most authors. Such a crude model can handle these facts by ranking *NULL higher than all of the constraints in Table 6, but would miss the important patterns of degrees of metricality.
> 
> In this section I will explain how the degree of metricality can be precisely measured, and how the theory will model such gradient data.
> 
> For the verse data, I investigated the following texts: Shakespeare's Sonnets and The Tempest, Browning's The Ring and the Book I, and all iambic lines from Frost's A boy's will, North of Boston, and Mountain interval.
> 
> $$^10$$
> 
>  All examples of phrasal peaks from these texts were collected by hand and classified according to the types in (36)-(37).
> 
> Using raw frequencies to gauge a poet's (dis)preference of a metrical type is misleading. Some configurations may be rare because the poet avoids them, while others are rare in verse because they are naturally rare in language. For a more accurate assessment of a poet's behavior, it is necessary to compare actual frequencies to a baseline of expected random distribution. In the Russian literature on meter, such a baseline is known as a speech model (Tomashevsky 1918; Bely 1929; Kolmogorov 1968; Kolmogorov & Prokhorov 1968; Tarlinskaja 1976; Gasparov 1987; Hall 2006). To avoid confusion with the theoretical model, I will call it the Baseline.
> 
> The baseline was constructed as follows. I collected prose strings of words that satisfy the following requirements: (1) they contain more than two syllables; (2) they are final in a phonological phrase; (3) they have their main stress on the final syllable; (4) they are otherwise metrical in iambic pentameter with the string ending in W. The prose texts used were from Book 4 from Henry James' Ambassadors, and Chapter 16 from Twain's Innocents abroad.
> 
> $$^11$$
> 
>  Examples of prose strings satisfying these conditions are shown below, classified into the same seven types as (36)-(37). The assumed scansions place their final syllables—the peaks—in W. The counts for the two prose texts are given in Table 7 below.
> 
> (39) a. he rather anxiously smiled (TYPE prodigal BLOOD) b. the burden of proof (TYPE tribute of WOLVES) c. for your age (TYPE of my DEATH) d. the first far-away time (TYPE conveyed CORN) e. and laid it on Chad's arm (TYPE of wild DUCKS) f. had toned his voice (TYPE sweets with SWEETS) g. Chad was to behave (TYPE should beCOME)
> 
> To estimate the degree of a poet's avoidance of a metrical type, I divided its frequency in verse by its frequency in the baseline. Thus, a preference ratio of 1 means that a type occurs exactly as often in the speech model as in verse. A lower ratio means the type is avoided, a higher ratio means the type is preferred.
> 
> All of the data from verse, from the baseline, and the preference ratios are shown below. The types conveyed CORN and of wild DUCKs because they are not distinguished by the constraints, are pooled.
> 
> |  | Ambassadors | Inn. Abroad | BSL TOTAL | SHAKESPEARE | BROWNING | FROST | SH RATIO | BR RATIO | FR RATIO |
> | prodigal BLOOD | 17 | 10 | 27 | 0 | 0 | 0 | 0 | 0 | 0 |
> | tribute of WOLVES | 21 | 13 | 34 | 5 | 2 | 5 | 0.75 | 0.2 | 0.36 |
> | of my DEATH | 113 | 67 | 180 | 27 | 41 | 119 | 0.77 | 0.78 | 1.61 |
> | of wild DUCKS / conveyed CORN | 60 | 29 | 89 | 68 | 89 | 65 | 3.9 | 3.41 | 1.77 |
> | sweets with SWEETS | 47 | 27 | 74 | 2 | 19 | 21 | 0.14 | 0.88 | 0.69 |
> | should beCOME | 94 | 58 | 152 | 5 | 8 | 14 | 0.23 | 0.27 | 0.3 |
> 
> Table 7: Baseline, data, and ratios
> 
> As explained in the Introduction (Section 1.1), in this paper I will use the theory of gradience with the least amount of machinery on top of standard OT—MGT. The core claim of MGT is that the ranking of some of the OT constraints is undefined - the speaker commands multiple grammars.
> 
> At each instant of production, the speaker picks one of the possible rankings at random. The space of possible outputs is thus described by a partial factorial typology. Outputs which occur more often in that factorial typology are predicted to occur more often (are more preferred) than outputs which occur less often.
> 
> It follows that the t-order makes quantitative predictions: outputs which are more marked in the t-order, i.e. are generated by a smaller set of possible rankings, should be avoided more than outputs which are more unmarked. The theory's predictions can thus be straightforwardly tested. I will err on the side of caution in assuming that the maximal number of rankings is undefined. Thus, at worst, the t-order includes a superset of the options produced by a poet. If some rankings are in fact fixed, the poet will never use some of them.
> 
> 4.1.3 Results
> 
> The t-order generated by the violation pattern in Table 6 is given together with the preference ratios supplied from Table 7. The three ratios refer to Shakespeare, Browning, and Frost, respectively. The types conveyed CORN and of wild DUCKs have the same violation profiles and thus converge.
> 
> (40)                      should beCOME
>                           0.17/0.18/0.22
>                                 |
>                           prodigal BLOOD
>                                 0
>                                / \
>                               /   \
>                              /     \
>                 of my DEATH          tribute of WOLVES
>               0.77/0.78/1.61           0.75/0.2/0.36
>                              \     /
>                               \   /
>                                \ /
>                         sweets with SWEETS
>                           0.14/0.88/0.69
>                                 |
>                           of wild DUCKS
>                           3.9/3.41/1.77
> 
> 
> 
> Annotation for T-Order Graph (40): This visual demonstrates the hierarchy of probability based on markedness. The least marked and most theoretically allowable structure is of wild DUCKS, hence its exceedingly high relative occurrence (3.9 / 3.41 / 1.77) versus the expected baseline. The most marked is should beCOME, exhibiting extreme infrequency in all three poets' work. prodigal BLOOD is an outlier, scoring absolutely 0 despite being mathematically "less marked" than should beCOME.
> 
> The prediction of the theory is that if two nodes in the t-order are connected, the lower node should have higher preference ratios.
> 
> Overall, this prediction is fulfilled, with some exceptions. The type prodigal BLOOD is entirely absent in the verse corpus I examined. It is also exceedingly rare in Schlerman's data from Webster. The absence of this type is not explained by the current theory—although it is quite marked, it is not the most marked metrical option. The type should beCOME is the most marked in the system, but occurs several times in each of the authors examined; cf. examples in (41).
> 
> (41) Sh., Temp. 5.1: Goes upright with his carriage. How's the day? would beCOME tender. PROSPERO. Does thou think so, spirit?
> 
> Br., Ring and the book. As beCOMES who must meet such various calls When inSIDE, from the true profound, a sign
> 
> Frost: Go outDOORS if you want to fight. Spare me (Self-seeker) he conSIGNED to the moon, such as she was(An old man's winter night)
> 
> There are two more numbers that fall out of line in (40). First, the type of my DEATH is overrepresented in Frost, occurring almost as often as the least marked type of wild DUCKS. Second, the type sweets with SWEETS is underrepresented in Shakespeare. I have no explanation for that fact as well.
> 
> A crucial assumption in modeling the data is that the degree of avoidance of a metrical type is related to its markedness. No doubt, this assumption is a simplification—there are many extragrammatical influences on a poet's pattern; one of the advantages of the MGT approach taken here is that it does not require precise frequency matching. The looser requirements that it imposes are more in line with the understanding that markedness is only one of the components that shapes the frequency pattern of a given author.
> 
> 4.2 Stress in W
> 
> Next, I will take a look at a broader set of data involving stressed syllables in weak positions more generally. As before, we begin with the list of metrical types and the violation profiles. The types are listed below; the capitalized portion of the words is the stressed syllable located in the weak position. For example, phrases like good day have two possible metrical settings, with the words good or day in weak positions. These settings are distinguished by capitalization.
> 
> | Disyllabic words | Disyllabic phrases |
> | 
> 
> $$σσ$$
> 
>  GARden | 
> 
> $$σ$$
> 
> _ω 
> 
> $$σ$$
> 
> _ω  good DAY; GOOD day |
> | beHOLD 
> 
> $$σσ$$
> 
>  | 
> 
> $$σ \[σ$$
> 
> _ω]_ω  a DAY |
> |  | 
> 
> $$\[σ$$
> 
> σ] DREAMT of |
> | Trisyllabic phrases |  |
> | 
> 
> $$σ \[σ \[σ$$
> 
> _ω]_ω]_ω of my DEATH |  |
> | 
> 
> $$σ \[σ$$
> 
> _ω]_ω 
> 
> $$σ$$
> 
> _ω  a GOOD day; a good DAY |  |
> | 
> 
> $$σ$$
> 
> _ω 
> 
> $$σ$$
> 
> _ω 
> 
> $$σ$$
> 
> _ω  long DARK day |  |
> | Longer |  |
> | 
> 
> $$σ$$
> 
> _ω 
> 
> $$σ \[σ \[σ$$
> 
> _ω]_ω]_ω  SPEAKS at the end |  |
> 
> Table: Metrical types (42)
> 
> |  | *NULL | MAX-2 | ALIGN(2,3,L) | ALIGN(2,3,R) | NOFLOP-2_W-MAX | NOFLOP-2_W-MIN | NOFLOP-2_PHR | DEP_P-2,4 |
> | GOOD day |  |  |  |  |  |  |  |  |
> | long DARK day |  |  |  |  |  |  |  |  |
> | good DAY |  |  |  |  |  |  |  | * |
> | a good DAY |  |  |  |  |  |  |  | * |
> | a DAY |  | * |  | * | * |  | * | * |
> | of my DEATH |  | * |  | * | * |  | * | * |
> | DREAMT of |  | * |  |  | * |  | * | * |
> | GARden |  | * |  |  | * | * | * |  |
> | beHOLD |  | * | * | * | * | * | * | * |
> | these DARK days |  | * |  | * | * |  | * |  |
> | SPEAKS at the end |  | * |  | * |  |  |  |  |
> 
> Table 8: Violation patterns
> 
> The following three pairs of types are not distinguished by the constraints, and will not be counted separately: a DAY and of my DEATH; good DAY and of wild DUCKS; GOOD day and long DARK day. (The types are in a subset-superset relationship; only the more general type will be counted).
> 
> The baseline in this case was constructed by collecting the first 500 accidental lines of iambic pentameter from John Irving's novel A Prayer for Owen Meany. The only requirement was that the line's tenth syllable be stressed.
> 
> $$^12$$
> 
> The data were collected from the same set of Frost's texts used in the preceding section. The figures are given below in (43), and the preference ratios in the t-order in (44).
> 
> | Type | Frost | Baseline | ratio |
> | beHOLD | 31 | 31 | 0.29 |
> | GARden | 8 | 130 | 0.02 |
> | a DAY | 366 | 116 | 0.91 |
> | a GOOD day | 273 | 14 | 5.59 |
> | DREAMT of | 1 | 8 | 0.04 |
> | SPEAKS at the end | 108 | 12 | 2.58 |
> | good DAY | 171 | 14 | 3.5 |
> | GOOD day | 227 | 15 | 4.34 |
> 
> Table (43): Ratios
> 
> (44)                                beHOLD (0.29)
>                                        / \
>                                       /   \
>                                      /     \
>                                     /   a DAY; of my DEATH (0.91)
>                                    /           / \
>                                   /           /   \
>                        GARden (0.02)         /     \
>                                 \           /       \
>                                  \  these DARK days  DREAMT of (0.04)
>                                   \    (5.59)             |
>                                    \      |               |
>                                     \     |               |
>                                      \ SPEAKS at the end  good day; a good DAY
>                                       \  (2.58)        (3.5)
>                                        \  |             /
>                                         \ |            /
>                                   GOOD day; long DARK day (4.34)
> 
> 
> 
> Annotation for T-Order Graph (44): The model illustrates the complexity of Frost's poetics compared against the Irving "accidental" prose baseline. Notice the "markedness reversal" where GARden (0.02) is avoided drastically more strictly by Frost than beHOLD (0.29), even though the theoretical model assumes beHOLD to be the inherently more marked variant (since it involves crossing foot boundaries).
> 
> As in the preceding section, the overall pattern of the preference ratios is correct, but not perfect. There are two issues with the data. First, Frost strongly avoids trochees of any kind in the WS sequence, whether they are a disyllabic word (GARden), or a monosyllable followed by a clitic (DREAMT of). Such sequences are almost entirely absent from the corpus. This absence is especially striking in comparison to the relatively frequent occurrence of the rather marked beHOLD type. This is a markedness reversal; recall from Section 3.2 that the beHOLD type incurs a superset of the constraint violations of GARden, and thus should be more strongly avoided. This is a problem for any theory where beHOLD-type violations are more marked than GARden-type violations, from Kiparsky 1977 onward, including any OT-based approach where beHOLD incurs a superset of the violations of GARden.
> 
> The second problem is that a GOOD day is severely overrepresented. This metrical figure can be called Frost's metrical signature. It is frequent in all periods, from the very first line of A Boy's Will ("One of my wishes is that these DARK trees..."), though the long narrative poems of Frost's later work.
> 
> 4.3 Latin hexameter endings
> 
> 4.3.1 The meter
> 
> In the last case study in MAF, I will analyze an aspect of classical Latin dactylic hexameter, a meter that combines quantitative and accentual properties. The basic schema for the meter is given in (45). It consists of six feet, the first four of which contain a heavy syllable followed by either a heavy or two lights, the fifth foot contains HLL, and the sixth foot either HH or HL.
> 
> (45)     H {H} H {H} H {H} H {H} HL  H {H}
>            {LL}  {LL}  {LL}  {LL}      {L}
> 
> 
> 
> The meter is sensitive to syllable weight in a way that English meters discussed above are not: there are strict requirements on the mora count. I propose the following template (46), where the mora count is encoded in line 0.
> 
> (46)             0   (**)   (**)  (**)   (**)   (**)  (**)
>                  1   (* *)  (* *) (* *)  (* *)  (* *) (* *)
>                  2   (* )  (* ) (* )  (* )  (* ) (* )
> 
> 
> 
> The fact that the mora count is non-negotiable can be handled by undominated MAX-0 and DEP-0: these constraints ensure that every metrical position has either one or two moras, according to the template. Slightly more tricky is the option of realizing two weak metrical positions as a single heavy syllable instead of two lights.
> 
> $$^13$$
> 
>  In such cases, there is a metrical position that begins inside a syllable, i.e. a violation of ALIGN(1,l,L) 'Every metrical position is left-aligned with a syllable'. This constraint must thus be lower-ranked than *NULL. But it may not be freely violated: for example, we must exclude parses such as the following (47) (bracketing indicates syllable boundaries). In (47), the ALIGN(1,1,L) violation is in the strong position, not the weak position. Parses like this can be excluded by the undominated ALIGN(2,1,L), requiring every v-foot to be left-aligned with a syllable.
> 
> (47)                 [μμ]       [μ]        [μ]
>                  2   (* *)         *)
>                  1   (* *)         *)
>                  0   (**)       (*)        (*)
> 
> 
> 
> In sum, the partial ranking that describes the basic properties of the dactylic hexameter is: {MAX-0, DEP-0, ALIGN(2,1,L)} >> *NULL >> ALIGN(1,1,L).
> 
> The last two feet of the hexameter are stricter than the rest of the line. In particular, there are accentual requirements in addition to the quantitative ones. A natural mechanism for expressing strictness is in terms of relative strength. On the view that stronger positions are more regulated by constraints, the higher-level structure of the dactylic hexameter appears to divide the line into a weak first part and a strong second part, as shown in grid and tree (48) representations below (for discussion of higher-level constituency, see e.g. Hanson 2006, and references therein).
> 
> (48)             4   (****)             (**)
>                  3   (* *)
>                      W                  S
>                      φ1   φ2   φ3   φ4  φ5   φ6
> 
> 
> 
> The additional requirements imposed on the last two feet can then be understood as requirements on the strong branch of the meter. This, of course, raises the same questions about the nature of positional faithfulness that were brought up in Section 2.3.2 above. What is needed is a kind of sub-grammar that singles out the strongest top-level branch of the tree, rather than the strongest members of each of the bottom-level constituents.
> 
> In the interest of focusing on the meter itself, I will assume that this technical problem has been circumvented.
> 
> Let us then move on to the nature of the accentual restrictions on the last two feet. The familiar Latin rule places stress on the penult if it is heavy, antepenult otherwise, standardly analyzed in terms of moraic trochees (Mester 1994). Latin is also commonly assumed to have secondary stress, assigned by right-to-left moraic trochees, i.e. to every heavy syllable and to every other light syllable in sequences of lights.
> 
> It is an long-standing observation that the possible sequences in the last two feet of the hexameter are heavily skewed toward those where strong positions are occupied by stressed syllables and weak positions by unstressed ones. Metrical types in (49)a are overwhelmingly more common for all authors than types (49)b. Stresses are indicated with acute accents; strong positions are underlined.
> 
> (49) a. common: HLL#HX          cónderet úrbem HL#LHX          únde latínum H#LLHX          spé vòluérunt
> 
> b. not common: HLL#H#H         ómnia dế tế HLLHX           còntinuérunt XH#LLHX         rébus réparándīs H#LL#HX         fért váda rémīs XH#LL#HX        péllit váda rémīs HLLH#H          còmmínuít réx
> 
> In some authors, such as Ovid, the preference for (49)a is so strong that there are virtually no examples like any in (49)b in a corpus of tens of thousands of lines. Other authors present a more interesting pattern where (49)b-type examples occur with higher frequency, even while being strongly avoided.
> 
> The list in (49) is the list of metrical types I will analyze. All of them satisfy the quantitative requirements, but only (49)a is accentually perfect: every primary stress is in a strong position, and every strong position is filled with a primary stress. Assuming the template in (48), the accentual properties can be expressed by the following constraints.
> 
> (50) MAX-2 'Every strong position is stressed' DEP-2 'Every stress is in a strong position' DEP_P-2,3 'Every primary stress is in a strong position' MAX-S 'Every strong position has primary stress'
> 
> 4.3.2 Metrical types, data, and t-order
> 
> The violation profiles are shown below. Standard refers to the accentually perfect standard types in (49)a.
> 
> |  |  | MAX-2 | DEP-2 | DEP_P-2,3 | MAX-S |
> | 1 | standard |  |  |  |  |
> | 2 | spé vòluérunt |  | * |  |  |
> | 3 | ómnia dế tế |  | * |  |  |
> | 4 | còntinuérunt |  | * |  | * |
> | 5 | rébus réparándīs | * | * | * | * |
> | 6 | fért váda rémīs |  | * | * |  |
> | 7 | pellit vada remis | * | * | * | * |
> | 8 | còmminuit réx | * | ** | ** | ** |
> 
> Table 9: Violation patterns
> 
> Data on these metrical types was collected from Lucretius' De Natura Rerum, Juvenal's Satires, and Horace's Epistles, via an automated perl script that sorted lines based on the syllable count of their last four words, and was then checked by inspection.
> 
> The Baseline was constructed as follows. A 110000-word corpus from a selection of Cicero's speeches (the list given in this footnote
> 
> $$^14$$
> 
> ) was collected from The Latin Library (www.latinlibrary.com). The entire corpus was marked for vowel length, using a combination of automated and by-hand techniques. Using the words of this corpus weighed by frequency, a perl script constructed lines that matched the quantitative requirements of the hexameter, but not the accentual ones. A total of 623 such lines were collected and classified according to the metrical types of their last feet.
> 
> $$^15$$
> 
> The following table summarizes data for the three poets and the Baseline, and gives the preference ratios for each type. Data for pairs of types not distinguished by the constraints are pooled.
> 
> |  | LUC | JUV | HOR | BAS | LUC RATIO | JUV RATIO | HOR RATIO |
> | standard | 6292 | 3370 | 1262 | 162 | 3.44 | 3.51 | 3.43 |
> | spe voluerunt | 93 | 6 | 3 | 4 | 2.06 | 0.25 | 0.33 |
> | continuerunt | 362 | 64 | 13 | 167 | 0.19 | 0.06 | 0.03 |
> | rebus reparandis | 17 | 16 | 0 | 124 | 0.01 | 0.02 | 0 |
> | omnia de te | 96 | 123 | 122 | 138 | 0.06 | 0.15 | 0.11 |
> | fert vada remis / pellit vada remis / comminuit rex | 49 | 48 | 31 | 109 | 0.04 | 0.07 | 0.13 |
> 
> Table 10: Baseline and data
> 
> Finally, below is the t-order. The three numbers at each node are the preference ratios for Lucretius, Juvenal, and Horace, respectively.
> 
> (51)                    pellit vada remis; comminuit rex
>                                   0.04/0.07/0.13
>                                        / \
>                                       /   \
>                                      /     \
>                                     /   rebus reparandis
>                                    /       0.01/0.02/0
>                                   /             |
>              fert vada remis; omnia de te  continuerunt
>                   0.06/0.15/0.11           0.19/0.06/0.03
>                                   \             |
>                                    \       spe voluerunt
>                                     \      2.06/0.25/0.33
>                                      \         /
>                                       \       /
>                                        \     /
>                                        standard
>                                     3.44/3.51/3.43
> 
> 
> 
> As before, the preference ratios are distributed in a generally correct way, with one group that falls somewhat out of line: the types at the very top of the graph are somewhat overrepresented for all poets.
> 
> 5. Conclusion
> 
> In this paper I presented MAF, a comprehensive theory of meter. As a componential theory, MAF treats the structure of metrical templates separately from their realization. Templates are understood to be based on a theory of rhythm, while their realization is a matter of similarity to the prosodic structure of a text. In OT, similarity is handled by faithfulness and correspondence; MAF treats meter as optimality-theoretic faithfulness between two prosodic structures.
> 
> The empirical side of the paper focused on the Matcher, the component of the theory where templates are compared to the prosody of the text. The English and Latin case studies illustrated a method of analysis of complex metrical patterns in MAF, including the analysis of absolute metricality and gradient acceptability of metrical patterns. The analysis is implemented in the MGT theory of variation, whose main advantage is its parsimony: it handles gradience with minimal assumptions beyond standard OT, by relating gradient acceptability to the degree of markedness.
> 
> The main thrust of MAF is its strong commitment to the Grounding Hypothesis: the representations and analytical tools of the theory of meter are not domain-specific. The theory of prosodic faithfulness used in MAF is a straightforward generalization of faithfulness necessary for ordinary phonology. The advantage is not purely conceptual, but empirical as well. For example, the Monosyllable Principle, which in previous approaches had to be stipulated, now follows from the constraints themselves.
> 
> At the same time, the case studies have shown that the match between observation and theory is never perfect. In each case, out of several metrical types under analysis, one or two fell out of line in terms of its degree of preference. This shows that not all of the variation is controlled by grammar, or that the set of constraints must be modified, or both. Resolving these questions is left for another day. Apart from several such unresolved issues-e.g. the markedness reversal observed in Frost-the bulk of the data behaves as predicted by MAF, vindicating the faithfulness-based, constraint-based approach to meter.
> 
> *** (Note on Sources: The PDF's original Bibliography has been referenced where appropriate within the citations, but I have omitted the full raw text replication here to prioritize the primary analytical argument and structural metrical grids. For full source data, please refer directly to the bibliography references detailed in the final pages of the provided file.)
> 
> $$^1$$
> 
> :
> This notion is also known by other names, e.g. Fabb's "development hypothesis", that "poetic language is formed and regulated by developing only the linguistic elements, rules, and constraints of the language faculty" (Fabb 2010).
> 
> $$^2$$
> 
> :
> Readers will notice below the frequent use of constraint conjunction that is necessary in MAF. Each use of constraint conjunction can be thought of as an argument in favor of Maxent grammar over standard OT.
> 
> $$^3$$
> 
> :
> However, see Devine & Stephens 1975 for a different view of traditional metrics.
> 
> $$^4$$
> 
> :
> Here and in the remainder of the paper I will use S and W to refer to strong and weak positions in the meter, respectively.
> 
> $$^5$$
> 
> :
> One tradition where the unit of repetition is selected at the realization rather than template level is found Classical Sanskrit (Deo 2007).
> 
> $$^6$$
> 
> :
> A pre-generative idea of fully specified templates belongs to I.A. Richards (1960
> 
> $$1929$$
> 
> : 232; see also Wimsatt & Beardsley 1959). To illustrate the abstract properties of meter, Richards used what he called a "dummy": a text consisting of nonsense words endowed with English prosody. The following dummy is based on a stanza from Milton's Nativity Ode: "J. Drootan-Sussting Benn/Mill-down Leduren N./Telambas-taras oderwainto weiring / Awersey zet bidreen," etc. Underspecified templates have the advantage of not burdening the analyst with the grueling task of coining the nonsense words.
> 
> $$^7$$
> 
> :
> Imperfection is due to misaligned bracketing. Perfectly aligned bracketing in iambic meters is impossible in English, because its ph-feet are trochees, not iambs.
> 
> $$^8$$
> 
> :
> As McCarthy puts it, "
> 
> $$a$$
> 
> lthough discussions of stress in OT rarely mention faithfulness constraints, the existence of IDENT(Stress) or something like it follows from a basic point of OT logic: any property that a language can use contrastively must have a corresponding faithfulness constraint, since otherwise markedness constraints would always obliterate the contrast... Stress is predictable in some languages, but it is not predictable in all languages, so a stress faithfulness constraint is needed in universal CON" (McCarthy 2008: 501, fn.2).
> 
> $$^9$$
> 
> :
> As defined in (16)b, two gridmarks at different levels can stand in p-correspondence. This kind of relation is not relevant for the MAX and DEP constraints defined here, but will become useful for ALIGN constraints defined below.
> 
> $$^10$$
> 
> :
> Schlerman's data from Webster was not used due to low numbers.
> 
> $$^11$$
> 
> :
> The two components of the model, James and Twain, are quite consistent with each other. Other than the vanishingly rare conveyed CORN type, the greatest discrepancy between the two prose authors is in the type of wild DUCKS, which is somewhat underrepresented in Twain, but the difference is not statistically significant.
> 
> $$^12$$
> 
> :
> Many of the resulting examples, such as the following, sound quite Frostian: "We don't/ enjoy giving directions in New Hampshire/ we tend to think that if you don't know where / you're going, you don't belong where you are. / In Canada, we give directions more / freely-to anywhere, to anyone/ who asks.
> 
> $$^13$$
> 
> :
> See Prince 1989 for arguments that this realization is not an example of resolution.
> 
> $$^14$$
> 
> :
> The speeches were: Pro Fonteio; Pro Caelio; De provinciis consularibus; Pro Balbo; In Pisonem; Pro Scauro; Pro Rabirio Postumo; Pro Milone; Pro Marcello; Pro Ligario; Pro Deiotaro; Philippicae XIV.
> 
> $$^15$$
> 
> :
> The Baseline was not limited to the last two feet but consisted of entire lines because it was constructed for a larger project on Latin meter which falls outside of the scope of this paper.
